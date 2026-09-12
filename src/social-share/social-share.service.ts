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
 * - Bütün ağlar aynı görseli kullanır: önce site tarafından üretilen
 *   1200×630 JPEG denenir, o adres görsel dönmezse haberin ham kapağına,
 *   o da yoksa metin/bağlantı gönderisine düşülür. Görsel yüzünden haberin
 *   HİÇ paylaşılmaması kabul edilebilir bir sonuç değil.
 */

type PaylasilacakHaber = {
  id: string;
  title: string;
  slug: string;
  type?: string | null;
  featuredImage?: string | null;
  /**
   * Haber bazında ağ seçimi (panelde haber formundaki kutucuklar).
   * null/undefined → ayarlarda açık olan TÜM ağlar (RSS içe aktarımı gibi
   * seçim yapmayan yollar bu davranışta kalır); [] → hiçbiri.
   */
  shareTargets?: unknown;
};

/**
 * Haberin ağ seçimini okunur bir denetleyiciye çevirir.
 *
 * Seçim yoksa her ağa "evet" der — eski kayıtlar ve panel dışından gelen
 * içerikler eskisi gibi davranmaya devam etsin.
 */
function agSecimi(shareTargets: unknown): (ag: string) => boolean {
  if (!Array.isArray(shareTargets)) return () => true;
  const secilenler = new Set(shareTargets.map((x) => String(x)));
  return (ag) => secilenler.has(ag);
}

/** Ağ adı → onu açıp kapatan kiracı ayarı. */
const AG_AYARLARI: ReadonlyArray<readonly [string, string]> = [
  ['telegram', 'autoShareTelegram'],
  ['facebook', 'autoShareFacebook'],
  ['instagram', 'autoShareInstagram'],
  ['x', 'autoShareTwitter'],
];

/** Panelin "Bağlantıyı Sına" düğmesine dönen sonuç. */
export type SinamaSonucu = { tamam: boolean; mesaj: string };

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
      // Haber formunda seçilmeyen ağ, ayarlarda açık olsa bile atlanır.
      const secili = agSecimi(haber.shareTargets);
      // Gidecek ağ yoksa görseli yoklamayalım — boşuna iki HTTP isteği.
      if (
        !AG_AYARLARI.some(
          ([ag, anahtar]) => secili(ag) && ayarlar[anahtar] === 'on',
        )
      ) {
        return;
      }

      // Ham kapak adresini tercih etmiyoruz: yeni yüklemeler WebP, Instagram
      // ise JPEG istiyor; eski kayıtlarda da yanlış/bayat yollar var. Site
      // bu uçta kapağı güvenli biçimde JPEG'e çevirip markalı bir yedek
      // üretiyor. Ama uç GERÇEKTEN görsel dönmeli — dönmezse aşağıdaki
      // sıralama ham kapağa, o da olmazsa metin gönderisine düşer.
      const gorsel = await this.gorselAdresi(siteKoku, haber);

      await Promise.allSettled([
        secili('telegram')
          ? this.telegram(tenantId, ayarlar, haber.title, baglanti, gorsel)
          : Promise.resolve(),
        secili('facebook')
          ? this.facebook(tenantId, ayarlar, haber.title, baglanti, gorsel)
          : Promise.resolve(),
        secili('instagram')
          ? this.instagram(tenantId, ayarlar, haber.title, baglanti, gorsel)
          : Promise.resolve(),
        secili('x')
          ? this.twitter(tenantId, ayarlar, haber.title, baglanti, gorsel)
          : Promise.resolve(),
      ]);
    } catch (err) {
      this.logger.warn(
        `Sosyal paylaşım atlandı (${tenantId}): ${(err as Error).message}`,
      );
    }
  }

  /**
   * BAĞLANTI SINAMASI — kanala/sayfaya hiçbir şey GÖNDERMEDEN kurulumu
   * denetler ve sorunu Türkçe olarak adıyla söyler.
   *
   * Var olma sebebi: paylaşım "ateşle ve unut" olduğu için hatalar yalnızca
   * sunucu günlüğüne düşüyor; panelden bakan kişi haberin neden kanala
   * düşmediğini göremiyordu. Sınama yalnızca OKUMA uçlarını çağırır —
   * test gönderisi atıp kanalı kirletmez.
   */
  async baglantiyiSina(tenantId: string, ag: string): Promise<SinamaSonucu> {
    try {
      const ayarlar = await this.settings.getAll(tenantId);
      switch (ag) {
        case 'telegram':
          return await this.telegramiSina(tenantId, ayarlar);
        case 'facebook':
          return await this.facebooguSina(tenantId, ayarlar);
        case 'instagram':
          return await this.instagramiSina(tenantId, ayarlar);
        case 'x':
          return await this.xiSina(tenantId);
        default:
          return { tamam: false, mesaj: `Bilinmeyen ağ: ${ag}` };
      }
    } catch (err) {
      return {
        tamam: false,
        mesaj: `Sınama tamamlanamadı: ${(err as Error).message}`,
      };
    }
  }

  private async telegramiSina(
    tenantId: string,
    ayarlar: Record<string, any>,
  ): Promise<SinamaSonucu> {
    const kanal = String(ayarlar.telegramChatId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'telegramBotToken');
    if (!token) {
      return { tamam: false, mesaj: 'Bot Token kayıtlı değil.' };
    }
    if (!kanal) {
      return {
        tamam: false,
        mesaj: 'Kanal Kimliği boş. Örnek: @kanaladi',
      };
    }

    const cagir = async (uc: string, sorgu?: Record<string, string>) => {
      const adres = new URL(`https://api.telegram.org/bot${token}/${uc}`);
      for (const [k, v] of Object.entries(sorgu ?? {})) {
        adres.searchParams.set(k, v);
      }
      const yanit = await fetch(adres, {
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const veri: any = await yanit.json().catch(() => ({}));
      return { tamam: yanit.ok && veri.ok !== false, veri };
    };

    const ben = await cagir('getMe');
    if (!ben.tamam) {
      return {
        tamam: false,
        mesaj: `Bot Token geçersiz görünüyor (Telegram: ${hataMesaji(ben.veri, 0)}). BotFather'dan yeni bir token alın.`,
      };
    }
    const botAdi = String(ben.veri?.result?.username ?? 'bot');
    const botId = ben.veri?.result?.id;

    const sohbet = await cagir('getChat', { chat_id: kanal });
    if (!sohbet.tamam) {
      const hata = hataMesaji(sohbet.veri, 0);
      return {
        tamam: false,
        mesaj: /not found/i.test(hata)
          ? `Kanal bulunamadı: ${kanal}. Kimliği @kanaladi biçiminde yazın ve @${botAdi} botunu kanala YÖNETİCİ olarak ekleyin.`
          : `Kanala erişilemedi (${hata}).`,
      };
    }

    const uye = await cagir('getChatMember', {
      chat_id: kanal,
      user_id: String(botId),
    });
    const durum = String(uye.veri?.result?.status ?? '');
    if (!uye.tamam || (durum !== 'administrator' && durum !== 'creator')) {
      return {
        tamam: false,
        mesaj: `@${botAdi} bu kanalda yönetici değil. Telegram'da kanalı açın → Yönet → Yöneticiler → Yönetici Ekle ile @${botAdi} botunu ekleyin.`,
      };
    }
    if (uye.veri?.result?.can_post_messages === false) {
      return {
        tamam: false,
        mesaj: `@${botAdi} yönetici ama "Mesaj gönder" yetkisi kapalı. Yönetici ayarlarından açın.`,
      };
    }

    const kanalAdi = String(sohbet.veri?.result?.title ?? kanal);
    return {
      tamam: true,
      mesaj: `Hazır — "${kanalAdi}" kanalına @${botAdi} olarak gönderim yapılabiliyor.`,
    };
  }

  private async facebooguSina(
    tenantId: string,
    ayarlar: Record<string, any>,
  ): Promise<SinamaSonucu> {
    const sayfa = String(ayarlar.facebookPageId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
    if (!token)
      return { tamam: false, mesaj: 'Sayfa Erişim Anahtarı kayıtlı değil.' };
    if (!sayfa) return { tamam: false, mesaj: 'Sayfa Kimliği boş.' };

    const yanit = await fetch(
      `${graphApiBase()}/${sayfa}?fields=name&access_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(ZAMAN_ASIMI_MS) },
    );
    const veri: any = await yanit.json().catch(() => ({}));
    return yanit.ok && veri?.name
      ? { tamam: true, mesaj: `Hazır — "${veri.name}" sayfasına bağlanıldı.` }
      : {
          tamam: false,
          mesaj: `Sayfaya erişilemedi (${hataMesaji(veri, yanit.status)}). Sayfa Kimliğini ve anahtarın süresini kontrol edin.`,
        };
  }

  private async instagramiSina(
    tenantId: string,
    ayarlar: Record<string, any>,
  ): Promise<SinamaSonucu> {
    const hesap = String(ayarlar.instagramUserId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'instagramToken');
    if (!token)
      return { tamam: false, mesaj: 'Erişim Anahtarı kayıtlı değil.' };
    if (!hesap) return { tamam: false, mesaj: 'Instagram Hesap Kimliği boş.' };

    const yanit = await fetch(
      `${graphApiBase()}/${hesap}?fields=username&access_token=${encodeURIComponent(token)}`,
      { signal: AbortSignal.timeout(ZAMAN_ASIMI_MS) },
    );
    const veri: any = await yanit.json().catch(() => ({}));
    return yanit.ok && veri?.username
      ? { tamam: true, mesaj: `Hazır — @${veri.username} hesabına bağlanıldı.` }
      : {
          tamam: false,
          mesaj: `Hesaba erişilemedi (${hataMesaji(veri, yanit.status)}). Hesabın İşletme/İçerik Üretici olduğundan ve bir Facebook sayfasına bağlı olduğundan emin olun.`,
        };
  }

  private async xiSina(tenantId: string): Promise<SinamaSonucu> {
    const token = await this.twitterToken(tenantId);
    if (!token)
      return { tamam: false, mesaj: 'Erişim Anahtarı kayıtlı değil.' };

    const yanit = await fetch(`${X_API}/2/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
    });
    const veri: any = await yanit.json().catch(() => ({}));
    return yanit.ok && veri?.data?.username
      ? {
          tamam: true,
          mesaj: `Hazır — @${veri.data.username} hesabına bağlanıldı.`,
        }
      : {
          tamam: false,
          mesaj: `Hesaba erişilemedi (${hataMesaji(veri, yanit.status)}). Anahtarın süresi dolmuş olabilir; yenileme anahtarı ve istemci bilgilerini de kaydedin.`,
        };
  }

  /**
   * Ağlara verilecek görsel adresini seçer — ve adresin gerçekten görsel
   * döndüğünü DOĞRULAR.
   *
   * Sıra: sitenin 1200×630 JPEG ucu → haberin ham kapağı → hiçbiri.
   * Doğrulama şart, çünkü site eski bir sürümdeyse o uç HTML (404 sayfası)
   * döner; Telegram ve Facebook fotoğrafı indiremeyince gönderiyi tümden
   * reddeder ve haber hiç paylaşılmamış olur. Görsel bulunamazsa null
   * döneriz: metin/bağlantı gönderisi atmak, hiç atmamaktan iyidir.
   */
  private async gorselAdresi(
    siteKoku: string,
    haber: PaylasilacakHaber,
  ): Promise<string | null> {
    const kapak = String(haber.featuredImage ?? '').trim();
    const adaylar = [
      `${siteKoku}/api/social-image/${encodeURIComponent(haber.slug)}`,
      /^https?:\/\//i.test(kapak) ? kapak : '',
    ].filter(Boolean);

    for (const aday of adaylar) {
      if (await this.gorselMi(aday)) return aday;
    }
    this.logger.warn(
      `Paylaşılabilir görsel bulunamadı (${haber.slug}); metin gönderisine düşülüyor`,
    );
    return null;
  }

  /** Adres görsel mi? HEAD desteklenmiyorsa GET'e düşer, gövdeyi indirmez. */
  private async gorselMi(adres: string): Promise<boolean> {
    const iste = (yontem: 'HEAD' | 'GET') =>
      fetch(adres, {
        method: yontem,
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });

    try {
      let yanit = await iste('HEAD');
      if (yanit.status === 405 || yanit.status === 501) {
        yanit = await iste('GET');
      }
      // Gövdeyi okumuyoruz; açık kalan akış bağlantıyı boşuna tutar.
      await yanit.body?.cancel().catch(() => undefined);
      const tur = (yanit.headers.get('content-type') ?? '')
        .split(';')[0]
        .trim()
        .toLowerCase();
      return yanit.ok && tur.startsWith('image/');
    } catch {
      return false;
    }
  }

  private async telegram(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
    gorsel: string | null,
  ): Promise<void> {
    if (ayarlar.autoShareTelegram !== 'on') return;
    const kanal = String(ayarlar.telegramChatId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'telegramBotToken');
    if (!kanal || !token) return;

    const metin = `${baslik}\n${baglanti}`;
    const cagir = async (uc: string, govde: Record<string, unknown>) => {
      const yanit = await fetch(`https://api.telegram.org/bot${token}/${uc}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: kanal, ...govde }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const veri: any = await yanit.json().catch(() => ({}));
      return {
        tamam: yanit.ok && veri.ok !== false,
        hata: hataMesaji(veri, yanit.status),
      };
    };

    try {
      // Görsel varsa fotoğraflı gönderi — kanalda kart gibi görünür.
      if (gorsel) {
        const foto = await cagir('sendPhoto', {
          photo: gorsel,
          caption: metin,
        });
        if (foto.tamam) return;
        // Fotoğrafı yutup sessiz kalmayız: düz metin gönderisi Telegram'ın
        // kendi bağlantı önizlemesiyle kanala yine de düşer.
        this.logger.warn(
          `Telegram fotoğraflı gönderi reddedildi (${tenantId}), metin olarak deneniyor: ${foto.hata}`,
        );
      }
      const yazi = await cagir('sendMessage', { text: metin });
      if (!yazi.tamam) {
        this.logger.warn(
          `Telegram paylaşımı reddedildi (${tenantId}): ${yazi.hata}`,
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
    gorsel: string | null,
  ): Promise<void> {
    if (ayarlar.autoShareFacebook !== 'on') return;
    const sayfa = String(ayarlar.facebookPageId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
    if (!sayfa || !token) return;

    const baglantiGonderisi = async () => {
      const yanit = await fetch(`${graphApiBase()}/${sayfa}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          message: baslik,
          link: baglanti,
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
    };

    try {
      // Fotoğraf gönderisi: link önizlemesi tarayıcısına bel bağlamaz. Görsel
      // doğrudan Facebook'a alınır, haber bağlantısı açıklamada yer alır.
      // Görsel yoksa ya da reddedilirse bağlantı gönderisine düşeriz.
      if (!gorsel) {
        await baglantiGonderisi();
        return;
      }
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
          `Facebook fotoğraflı gönderi reddedildi (${tenantId}), bağlantı olarak deneniyor: ${hataMesaji(veri, yanit.status)}`,
        );
        await baglantiGonderisi();
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
    gorsel: string | null,
  ): Promise<void> {
    if (ayarlar.autoShareInstagram !== 'on') return;
    const hesap = String(ayarlar.instagramUserId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'instagramToken');
    if (!hesap || !token) return;
    if (!gorsel) {
      // Instagram görselsiz gönderi kabul etmez — metne düşemeyiz.
      this.logger.warn(
        `Instagram paylaşımı atlandı (${tenantId}): paylaşılabilir görsel yok`,
      );
      return;
    }
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
    gorsel: string | null,
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
        if (!gorsel) throw new Error('paylaşılabilir görsel yok');
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
