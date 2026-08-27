import { Injectable, Logger } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

/**
 * OTOMATİK SOSYAL PAYLAŞIM — haber YAYINA GİRDİĞİ anda çalışır.
 *
 * Üç ağ, üçü de kiracı ayarlarından açılıp kapanır (autoShare* = 'on').
 * Kimlik bilgileri: kanal/sayfa kimlikleri düz ayar, token'lar şifreli
 * sır (bkz. secret-settings.ts).
 *
 * Tasarım kuralları:
 * - ASLA yayını bloklamaz: bütün ağ hataları yutulur ve loglanır. Editör
 *   "kaydet"e bastığında Telegram çöktü diye haber yayınlanmamazlık edemez.
 * - Yalnızca DURUM GEÇİŞİNDE tetiklenir (taslak → yayında); yayındaki bir
 *   haberi düzenlemek yeniden paylaşmaz — mükerrer gönderi, silinmesi
 *   bizde olmayan bir mecrada kalıcı kirlilik demek.
 * - Instagram görselsiz gönderi kabul etmiyor; görselsiz haberde IG atlanır.
 */

type PaylasilacakHaber = {
  id: string;
  title: string;
  slug: string;
  type?: string | null;
  featuredImage?: string | null;
};

const ZAMAN_ASIMI_MS = 10_000;
const GRAPH = 'https://graph.facebook.com/v19.0';

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
      const siteKoku = String(ayarlar.siteUrl ?? '').trim().replace(/\/+$/, '');
      if (!siteKoku) return; // Bağlantı üretemeyiz — paylaşmanın anlamı yok.

      const yol = haber.type === 'COLUMN' ? `/makale/${haber.slug}` : `/haber/${haber.slug}`;
      const baglanti = `${siteKoku}${yol}`;
      const gorsel =
        typeof haber.featuredImage === 'string' && /^https?:\/\//.test(haber.featuredImage)
          ? haber.featuredImage
          : null;

      await Promise.allSettled([
        this.telegram(tenantId, ayarlar, haber.title, baglanti, gorsel),
        this.facebook(tenantId, ayarlar, haber.title, baglanti),
        this.instagram(tenantId, ayarlar, haber.title, baglanti, gorsel),
      ]);
    } catch (err) {
      this.logger.warn(`Sosyal paylaşım atlandı (${tenantId}): ${(err as Error).message}`);
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

    try {
      // Görsel varsa fotoğraflı gönderi — kanalda kart gibi görünür.
      const [uc, gövde] = gorsel
        ? ['sendPhoto', { chat_id: kanal, photo: gorsel, caption: `${baslik}\n${baglanti}` }]
        : ['sendMessage', { chat_id: kanal, text: `${baslik}\n${baglanti}` }];
      const yanit = await fetch(`https://api.telegram.org/bot${token}/${uc}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gövde),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const veri: any = await yanit.json().catch(() => ({}));
      if (!yanit.ok || veri.ok === false) {
        this.logger.warn(`Telegram paylaşımı reddedildi (${tenantId}): ${veri.description ?? yanit.status}`);
      }
    } catch (err) {
      this.logger.warn(`Telegram paylaşım hatası (${tenantId}): ${(err as Error).message}`);
    }
  }

  private async facebook(
    tenantId: string,
    ayarlar: Record<string, any>,
    baslik: string,
    baglanti: string,
  ): Promise<void> {
    if (ayarlar.autoShareFacebook !== 'on') return;
    const sayfa = String(ayarlar.facebookPageId ?? '').trim();
    const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
    if (!sayfa || !token) return;

    try {
      // Bağlantılı gönderi: Facebook önizlemeyi sayfanın og etiketlerinden kurar.
      const yanit = await fetch(`${GRAPH}/${sayfa}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: baslik, link: baglanti, access_token: token }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      if (!yanit.ok) {
        const veri: any = await yanit.json().catch(() => ({}));
        this.logger.warn(`Facebook paylaşımı reddedildi (${tenantId}): ${veri?.error?.message ?? yanit.status}`);
      }
    } catch (err) {
      this.logger.warn(`Facebook paylaşım hatası (${tenantId}): ${(err as Error).message}`);
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
      // IG görselsiz gönderi kabul etmiyor; sessiz atlamak yerine iz bırak.
      this.logger.warn(`Instagram paylaşımı atlandı (${tenantId}): haberin mutlak adresli görseli yok`);
      return;
    }

    try {
      // İki aşama: önce medya kabı, sonra yayınlama (IG Graph akışı).
      const kap = await fetch(`${GRAPH}/${hesap}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: gorsel,
          // IG açıklamasında tıklanabilir bağlantı yok; yine de kaynak belli olsun.
          caption: `${baslik}\n${baglanti}`,
          access_token: token,
        }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      const kapVerisi: any = await kap.json().catch(() => ({}));
      if (!kap.ok || !kapVerisi.id) {
        this.logger.warn(`Instagram medya kabı reddedildi (${tenantId}): ${kapVerisi?.error?.message ?? kap.status}`);
        return;
      }
      const yayin = await fetch(`${GRAPH}/${hesap}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creation_id: kapVerisi.id, access_token: token }),
        signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
      });
      if (!yayin.ok) {
        const veri: any = await yayin.json().catch(() => ({}));
        this.logger.warn(`Instagram yayınlama reddedildi (${tenantId}): ${veri?.error?.message ?? yayin.status}`);
      }
    } catch (err) {
      this.logger.warn(`Instagram paylaşım hatası (${tenantId}): ${(err as Error).message}`);
    }
  }
}
