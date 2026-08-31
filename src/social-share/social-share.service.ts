import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

/**
 * OTOMATİK SOSYAL PAYLAŞIM — haber YAYINA GİRDİĞİ anda çalışır.
 *
 * Dört ağ, dördü de kiracı ayarlarından açılıp kapanır (autoShare* = 'on').
 * Kimlik bilgileri: kanal/sayfa kimlikleri düz ayar, token'lar şifreli
 * sır (bkz. secret-settings.ts).
 *
 * Tasarım kuralları:
 * - ASLA yayını bloklamaz: bütün ağ hataları yutulur ve loglanır. Editör
 *   "kaydet"e bastığında Telegram çöktü diye haber yayınlanmamazlık edemez.
 * - Yalnızca DURUM GEÇİŞİNDE tetiklenir (taslak → yayında); yayındaki bir
 *   haberi düzenlemek yeniden paylaşmaz — mükerrer gönderi, silinmesi
 *   bizde olmayan bir mecrada kalıcı kirlilik demek.
 * - Bütün ağlar aynı, site tarafından üretilen 1200×630 JPEG'i kullanır.
 *   Böylece ham medya WebP olsa veya eski görsel yolu bozulsa bile sosyal
 *   ağlara her zaman doğrudan indirilebilir, standart bir görsel gider.
 */

type PaylasilacakHaber = {
  id: string;
  title: string;
  slug: string;
  type?: string | null;
  featuredImage?: string | null;
};

const ZAMAN_ASIMI_MS = 10_000;
const X_API = 'https://api.x.com';

function graphApiBase(): string {
  const surum = (process.env.META_GRAPH_VERSION ?? 'v25.0').trim();
  return `https://graph.facebook.com/${/^v\d+\.\d+$/.test(surum) ? surum : 'v25.0'}`;
}

function hataMesaji(veri: any, durum: number): string {
  return String(
    veri?.error?.message ??
      veri?.detail ??
      veri?.title ??
      veri?.description ??
      durum,
  );
}

/** X bağlantıları 23 karakter sayar; 250 karakter başlık güvenli pay bırakır. */
function xMetni(baslik: string, baglanti: string): string {
  const temiz = baslik.replace(/\s+/g, ' ').trim();
  const kisaltilmis =
    temiz.length > 250 ? `${temiz.slice(0, 247).trimEnd()}…` : temiz;
  return `${kisaltilmis}\n${baglanti}`;
}

@Injectable()
export class SocialShareService {
  private readonly logger = new Logger(SocialShareService.name);

  constructor(private readonly settings: SettingsService) {}

  /**
   * Ateşle ve unut — çağıran await ETMEMELİ (void ile çağır). İçerideki her
   * ağ kendi hatasını yakalar; buradan hata çıkmaz.
   */
  async paylas(tenantId: string, haber: PaylasilacakHaber): Promise<void> {
    try {
      const ayarlar = await this.settings.getAll(tenantId);
      const siteKoku = String(ayarlar.siteUrl ?? '')
        .trim()
        .replace(/\/+$/, '');
      if (!siteKoku) return; // Bağlantı üretemeyiz — paylaşmanın anlamı yok.

      const yol =
        haber.type === 'COLUMN'
          ? `/makale/${haber.slug}`
          : `/haber/${haber.slug}`;
      const baglanti = `${siteKoku}${yol}`;
      // Ham kapak adresini sosyal ağlara vermiyoruz. Yeni yüklemeler WebP,
      // Instagram ise JPEG istiyor; eski kayıtlarda da yanlış/bayat yollar var.
      // Site bu uçta kapağı güvenli biçimde JPEG'e çevirip markalı bir yedek
      // üretiyor. Kapaksız haber bile boş görselle paylaşılmıyor.
      const gorsel = `${siteKoku}/api/social-image/${encodeURIComponent(haber.slug)}`;

      await Promise.allSettled([
        this.telegram(tenantId, ayarlar, haber.title, baglanti, gorsel),
        this.facebook(tenantId, ayarlar, haber.title, baglanti, gorsel),
        this.instagram(tenantId, ayarlar, haber.title, baglanti, gorsel),
        this.twitter(tenantId, ayarlar, haber.title, baglanti, gorsel),
      ]);
    } catch (err) {
      this.logger.warn(
        `Sosyal paylaşım atlandı (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  private async telegram(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
    gorsel: string,
  ): Promise<void> {
    if (ayarlar.autoShareTelegram !== 'on') return;
    const kanal = String(ayarlar.telegramChatId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'telegramBotToken');
    if (!kanal || !token) return;

    try {
      // Görsel varsa fotoğraflı gönderi — kanalda kart gibi görünür.
      const yanit = await fetch(
        `https://api.telegram.org/bot${token}/sendPhoto`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: kanal,
            photo: gorsel,
            caption: `${baslik}\n${baglanti}`,
          }),
          signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
        },
      );
      const veri: any = await yanit.json().catch(() => ({}));
      if (!yanit.ok || veri.ok === false) {
        this.logger.warn(
          `Telegram paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Telegram paylaşım hatası (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  private async facebook(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
    gorsel: string,
  ): Promise<void> {
    if (ayarlar.autoShareFacebook !== 'on') return;
    const sayfa = String(ayarlar.facebookPageId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
    if (!sayfa || !token) return;

    try {
      // Fotoğraf gönderisi: link önizlemesi tarayıcısına bel bağlamaz. Görsel
      // doğrudan Facebook'a alınır, haber bağlantısı açıklamada yer alır.
      const yanit = await fetch(`${graphApiBase()}/${sayfa}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          url: gorsel,
          caption: `${baslik}\n\n${baglanti}`,
          access_token: token,
        }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      if (!yanit.ok) {
        const veri: any = await yanit.json().catch(() => ({}));
        this.logger.warn(
          `Facebook paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Facebook paylaşım hatası (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  private async instagram(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
    gorsel: string,
  ): Promise<void> {
    if (ayarlar.autoShareInstagram !== 'on') return;
    const hesap = String(ayarlar.instagramUserId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'instagramToken');
    if (!hesap || !token) return;
    try {
      // İki aşama: önce medya kabı, sonra yayınlama (IG Graph akışı).
      const kap = await fetch(`${graphApiBase()}/${hesap}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          image_url: gorsel,
          // IG açıklamasında tıklanabilir bağlantı yok; yine de kaynak belli olsun.
          caption: `${baslik}\n${baglanti}`,
          access_token: token,
        }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const kapVerisi: any = await kap.json().catch(() => ({}));
      if (!kap.ok || !kapVerisi.id) {
        this.logger.warn(
          `Instagram medya kabı reddedildi (${tenantId}): ${hataMesaji(kapVerisi, kap.status)}`,
        );
        return;
      }
      const yayin = await fetch(`${graphApiBase()}/${hesap}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          creation_id: kapVerisi.id,
          access_token: token,
        }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      if (!yayin.ok) {
        const veri: any = await yayin.json().catch(() => ({}));
        this.logger.warn(
          `Instagram yayınlama reddedildi (${tenantId}): ${hataMesaji(veri, yayin.status)}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `Instagram paylaşım hatası (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  private async twitter(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
    gorsel: string,
  ): Promise<void> {
    if (ayarlar.autoShareTwitter !== 'on') return;
    const token = await this.twitterToken(tenantId);
    if (!token) return;

    try {
      let medyaId: string | null = null;

      // X v2 görsel yükleme: önce bizim standart JPEG'i indir, sonra base64
      // olarak media/upload'a aktar. Görsel adımı başarısız olsa bile haber
      // bağlantısını metin gönderisi olarak yayınlamaya devam ederiz.
      try {
        const resimYaniti = await fetch(gorsel, {
          signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
        });
        const tur =
          resimYaniti.headers.get('content-type')?.split(';')[0] ?? '';
        const resim = Buffer.from(await resimYaniti.arrayBuffer());
        if (
          !resimYaniti.ok ||
          !tur.startsWith('image/') ||
          resim.length > 5 * 1024 * 1024
        ) {
          throw new Error(
            `sosyal görsel uygun değil (HTTP ${resimYaniti.status}, ${tur || 'tür yok'}, ${resim.length} byte)`,
          );
        }

        const yukleme = await fetch(`${X_API}/2/media/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            media: resim.toString('base64'),
            media_category: 'tweet_image',
          }),
          signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
        });
        const yuklemeVerisi: any = await yukleme.json().catch(() => ({}));
        if (!yukleme.ok || !yuklemeVerisi?.data?.id) {
          throw new Error(hataMesaji(yuklemeVerisi, yukleme.status));
        }
        medyaId = String(yuklemeVerisi.data.id);
      } catch (err) {
        this.logger.warn(
          `X görsel yükleme atlandı (${tenantId}), bağlantı metin olarak paylaşılacak: ${(err as Error).message}`,
        );
      }

      const govde: Record<string, any> = { text: xMetni(baslik, baglanti) };
      if (medyaId) govde.media = { media_ids: [medyaId] };

      const yanit = await fetch(`${X_API}/2/tweets`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(govde),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      if (!yanit.ok) {
        const veri: any = await yanit.json().catch(() => ({}));
        this.logger.warn(
          `X paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`,
        );
      }
    } catch (err) {
      this.logger.warn(
        `X paylaşım hatası (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  /**
   * X OAuth 2.0 erişim anahtarları varsayılan olarak kısa ömürlüdür. Panelde
   * offline.access ile alınmış yenileme anahtarı ve gizli istemci bilgileri
   * varsa her paylaşım öncesinde anahtarı yeniler, dönen rotasyonlu yenileme
   * anahtarını da şifreli ayara geri yazarız. Eksik/eski kurulumlarda kayıtlı
   * erişim anahtarıyla denemeye devam edilir.
   */
  private async twitterToken(tenantId: string): Promise<string | null> {
    const [mevcut, yenileme, istemci, istemciSirri] = await Promise.all([
      this.settings.getSecret(tenantId, 'twitterAccessToken'),
      this.settings.getSecret(tenantId, 'twitterRefreshToken'),
      this.settings.getSecret(tenantId, 'twitterClientId'),
      this.settings.getSecret(tenantId, 'twitterClientSecret'),
    ]);
    if (!yenileme || !istemci || !istemciSirri) return mevcut;

    try {
      const yanit = await fetch(`${X_API}/2/oauth2/token`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${istemci}:${istemciSirri}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: yenileme,
          grant_type: 'refresh_token',
        }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const veri: any = await yanit.json().catch(() => ({}));
      if (!yanit.ok || !veri.access_token) {
        this.logger.warn(
          `X erişim anahtarı yenilenemedi (${tenantId}): ${hataMesaji(veri, yanit.status)}`,
        );
        return mevcut;
      }

      const yeniErisim = String(veri.access_token);
      await Promise.all([
        this.settings.upsert(tenantId, 'twitterAccessToken', yeniErisim),
        veri.refresh_token
          ? this.settings.upsert(
              tenantId,
              'twitterRefreshToken',
              String(veri.refresh_token),
            )
          : Promise.resolve(),
      ]);
      return yeniErisim;
    } catch (err) {
      this.logger.warn(
        `X erişim anahtarı yenileme hatası (${tenantId}): ${(err as Error).message}`,
      );
      return mevcut;
    }
  }
}
