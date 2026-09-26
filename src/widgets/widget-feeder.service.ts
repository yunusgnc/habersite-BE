import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import sharp from 'sharp';
import { Agent as HttpsAgent } from 'https';

/**
 * TFF isteklerine ÖZEL https agent'ı — sertifika doğrulaması kapalı.
 *
 * NEDEN: tff.org sertifika zincirini eksik gönderiyor. Tarayıcı ve curl
 * eksik ara sertifikayı kendi deposundan tamamlıyor, Node tamamlayamıyor ve
 * isteği `UNABLE_TO_VERIFY_LEAF_SIGNATURE` ile reddediyor.
 *
 * NEDEN SÜREÇ GENELİNDE DEĞİL: `NODE_TLS_REJECT_UNAUTHORIZED=0` bütün
 * bağlantıların doğrulamasını kaldırırdı — veritabanı, R2 depolama, yapay
 * zekâ sağlayıcıları dahil. Bu agent yalnızca bu tek isteğe veriliyor.
 *
 * KABUL EDİLEN RİSK: ağ yolundaki biri bu isteğin yanıtını değiştirebilir.
 * Etkisi sınırlı — gelen veri herkese açık maç takvimi, kimlik bilgisi ya da
 * kullanıcı verisi taşımıyor; en kötü hâlde sitede yanlış maç saati görünür.
 * Bilinçli bir karar, kolaylık için değil zorunluluktan.
 */
const TFF_AGENT = new HttpsAgent({ rejectUnauthorized: false });
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { STORAGE_ADAPTER } from '../media/storage/storage.module';
import type { StorageAdapter } from '../media/storage/storage.types';
import { WidgetsService } from './widgets.service';

/**
 * `prev` = widget'ın o anki cache'i. Dış kaynak kısmen çökerse feeder eldeki
 * son sağlam değeri geri verebilsin diye geçiliyor — böylece bir uçuşta
 * bozulan veri, çalışan veriyi ezmiyor.
 *
 * `tenantId` yalnızca kendi bucket'ımıza yazması gereken besleyiciler için
 * gerekli (gazete kapakları).
 */
type Feeder = (config: any, prev?: any, tenantId?: string) => Promise<any>;

/**
 * Scrape edilen siteler bot filtresi uyguluyor. Yalnızca User-Agent yetmiyor —
 * axios'un varsayılan `Accept: application/json` başlığı eczaneler.gen.tr'de
 * 403'e yol açıyordu. Tarayıcının gönderdiği başlık setini taklit et.
 */
const SCRAPE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
  'Upgrade-Insecure-Requests': '1',
} as const;


/** Şeritte ve okuma modalında kullanılan tek bir gazete kapağı. */
export type KapakOgesi = {
  name: string;
  slug: string;
  /** Kaynaktaki kapak adresi; aynalamadan sonra kendi adresimizle değişir. */
  image: string;
  /** Kaynaktaki en büyük sürüm — okuma modalı bunu istiyor. */
  imageFull: string;
  /** Gazetenin kaynaktaki sayfası ("Kaynak" düğmesi). */
  url: string;
  date: string;
  /** Hangi kaynaktan geldi — tanılama için önbelleğe yazılıyor. */
  source: string;
};

type GazeteKaynagi = {
  ad: string;
  url: string;
  /** Hata kaydında yazılacak işaretçi — kaynak yapısını değiştirince belli olsun. */
  secici: string;
  ayikla: ($: cheerio.CheerioAPI) => KapakOgesi[];
};

/**
 * GAZETE KAPAĞI KAYNAKLARI — sırayla denenir, ilk dolu liste kazanır.
 *
 * Neden birden fazla: kaynaklar sunucu IP'lerini engelliyor. gazeteoku.com
 * bizim VPS'e 403 döndürdü (ev bağlantısından 200) ve şerit boş kaldı. Tek
 * kaynağa bağlı kalmak o günü tamamen kaybettiriyor.
 *
 * Yeni kaynak eklemek: diziye bir öğe daha yaz. Çekme, yeniden deneme,
 * tekilleştirme, aynalama ve hata kaydı ortak — ayıklayıcıdan başka bir şey
 * yazmak gerekmiyor.
 *
 * Sıra kasıtlı: gazeteoku en yüksek çözünürlüğü (1280x~2150, kırpılmamış)
 * ve en çok gazeteyi veriyor.
 */
export const GAZETE_KAYNAKLARI: GazeteKaynagi[] = [
  {
    ad: 'gazeteoku.com',
    url: 'https://www.gazeteoku.com/gazeteler',
    secici: '.newspapers a[href*="-manseti"]',
    /**
     * Sayfa yapısı (2026-09 itibarıyla doğrulandı):
     *   .newspapers a[href*="-manseti"]
     *     ├─ <strong>HÜRRİYET</strong>          → ad
     *     ├─ <small>26 Eylül 2026</small>       → tarih
     *     └─ <img src="blank.png" data-src="…"> → kapak (LAZY: adres data-src'de)
     *
     * Görsel adresi `/3/{w}/{h}/storage/…` biçiminde boyut taşıyor. Boyut
     * segmenti tamamen atılınca kaynağın ORİJİNALİ geliyor: 1280x~2150.
     * `/3/1240/1754/` varyantı A4 oranına zorlayıp gazetenin altını kesiyor.
     */
    ayikla: ($) => {
      const kapaklar: KapakOgesi[] = [];
      $('.newspapers a[href*="-manseti"]').each((_, el) => {
        const $el = $(el);
        const $img = $el.find('img').first();

        const thumb = $img.attr('data-src') || $img.attr('src') || '';
        if (!thumb || thumb.includes('blank.png')) return;

        const name =
          $el.attr('title')?.trim() ||
          $img.attr('alt')?.trim() ||
          $el.find('strong').first().text().trim();
        if (!name) return;

        const href = $el.attr('href') || '';
        kapaklar.push({
          name,
          slug:
            href.split('/').pop()?.replace(/-gazetesi-manseti$/, '') ||
            slugify(name, { lower: true, strict: true, locale: 'tr' }),
          image: thumb,
          imageFull: thumb.replace(/^(https?:\/\/[^/]+)\/\d+\/\d+\/\d+\//, '$1/'),
          url: href.startsWith('http') ? href : `https://www.gazeteoku.com${href}`,
          date: $el.find('small').first().text().trim(),
          source: 'gazeteoku.com',
        });
      });
      return kapaklar;
    },
  },
  {
    ad: 'gazetemanset.gzt.com',
    url: 'https://gazetemanset.gzt.com/',
    secici: 'a[href*="-gazetesi/"] img[src*="img.piri.net"]',
    /**
     * Sayfa yapısı (2026-09 itibarıyla doğrulandı):
     *   a[href="/yenisafak-gazetesi/26-09-2026"]
     *     └─ img[src="https://img.piri.net/…jpg"]
     *        alt="Yeni Şafak Gazetesi 26 Eylül 2026, Cumartesi Günü Manşeti"
     *
     * Ad ve tarih yalnızca `alt` içinde; ayrı bir etiket yok. Tek boy
     * sunuluyor (1080x1591) — `image` ile `imageFull` aynı adres, küçük kart
     * görselini biz `sharp` ile üretiyoruz.
     */
    ayikla: ($) => {
      const kapaklar: KapakOgesi[] = [];
      $('a[href*="-gazetesi/"]').each((_, el) => {
        const $el = $(el);
        const $img = $el.find('img[src*="img.piri.net"]').first();
        const adres = $img.attr('src') || '';
        if (!adres) return;

        const alt = ($img.attr('alt') || '').trim();
        // "Yeni Şafak Gazetesi 26 Eylül 2026, Cumartesi Günü Manşeti"
        const parcali = alt.match(/^(.+?)\s+Gazetesi\s+(.+?)(?:,|$)/);
        const href = $el.attr('href') || '';
        const name = parcali?.[1]?.trim() || alt;
        if (!name) return;

        kapaklar.push({
          name,
          slug:
            href.split('/').filter(Boolean)[0]?.replace(/-gazetesi$/, '') ||
            slugify(name, { lower: true, strict: true, locale: 'tr' }),
          image: adres,
          imageFull: adres,
          url: href.startsWith('http') ? href : `https://gazetemanset.gzt.com${href}`,
          date: parcali?.[2]?.trim() ?? '',
          source: 'gazetemanset.gzt.com',
        });
      });
      return kapaklar;
    },
  },
];

/** Aynı gazeteyi bir kez bırakır — sayfalar kapağı birden çok yerde basıyor. */
export function tekilKapaklar(kapaklar: KapakOgesi[]): KapakOgesi[] {
  const gorulen = new Set<string>();
  return kapaklar.filter((it) => {
    const anahtar = it.slug || it.name;
    if (gorulen.has(anahtar)) return false;
    gorulen.add(anahtar);
    return true;
  });
}

/**
 * Puan durumu / fikstür bileşeninin desteklediği ligler.
 *
 * KAYNAK SEÇİMİ: TheSportsDB'nin ücretsiz katmanı denendi ve lig başına
 * yalnızca 5 takım + 1 maç döndürüyor — 18 takımlık bir tablo için
 * kullanılamaz. Wikipedia'nın sezon sayfaları tam tabloyu veriyor, anahtar
 * istemiyor ve yapısı yıllardır sabit. Fikstür için TFF'nin kendi sayfası
 * kullanılıyor (yalnızca Türkiye ligleri; Avrupa ligleri için ücretsiz ve
 * anahtarsız bir fikstür kaynağı bulunamadı, o sekme onlarda gizleniyor).
 *
 * `wikiSayfa` içindeki sezon her yıl değişiyor. Sayfa bulunamazsa besleyici
 * bir önceki sezonu deniyor — ağustosta yeni sezon sayfası bazen birkaç gün
 * geç açılıyor ve tablo o sırada boşalmamalı.
 */
type LigTanimi = {
  anahtar: string;
  ad: string;
  wiki: string;
  wikiDil: 'tr' | 'en';
  /** TFF sayfa kimliği — yalnızca fikstürü olan ligler için. */
  tffSayfa?: number;
};

const VARSAYILAN_LIGLER: LigTanimi[] = [
  { anahtar: 'super-lig', ad: 'Trendyol Süper Lig', wiki: '{SEZON}_Süper_Lig', wikiDil: 'tr', tffSayfa: 198 },
  // 1. Lig'in fikstür sayfası TFF'de ayrı bir adreste ve gezinmeden
  // bulunamıyor; boş istek atmak yerine fikstürsüz bırakıldı. Puan durumu
  // Wikipedia'dan tam geliyor, site bu ligde yalnızca puan sekmesi gösteriyor.
  { anahtar: 'birinci-lig', ad: 'Trendyol 1. Lig', wiki: '{SEZON}_1._Lig', wikiDil: 'tr' },
  { anahtar: 'laliga', ad: 'LaLiga', wiki: '{SEZON}_La_Liga', wikiDil: 'en' },
  { anahtar: 'premier-lig', ad: 'Premier League', wiki: '{SEZON}_Premier_League', wikiDil: 'en' },
  { anahtar: 'bundesliga', ad: 'Bundesliga', wiki: '{SEZON}_Bundesliga', wikiDil: 'en' },
];

/**
 * Futbol sezonu takvim yılıyla aynı değil: ağustosta başlayıp mayısta
 * bitiyor. Temmuz ve öncesi bir önceki sezona ait.
 */

/**
 * Tablo başlığını ortak alan adına çevirir (Türkçe + İngilizce).
 *
 * NEDEN BAŞLIĞA GÖRE: ilk sürüm sütunları sabit sıraya göre okuyordu ve
 * Avrupa liglerinde takım adı yerine maç sayısını alıyordu — o tablolarda
 * sıra ve takım hücreleri `<th>`, kalanlar `<td>`. Sabit indeks iki farklı
 * tablo düzeninde aynı anda doğru olamaz; başlık ismi ise ikisinde de aynı.
 */
function puanSutunu(baslik: string): string | null {
  const b = baslik.replace(/\[.*?\]/g, '').trim().toLowerCase();
  if (/^(sıra|pos|#|no)\.?$/.test(b)) return 'sira';
  if (/^(takım|team|club|kulüp)/.test(b)) return 'takim';
  if (/^(o|pld|mp)$/.test(b)) return 'oynadi';
  if (/^(g|w)$/.test(b)) return 'galibiyet';
  if (/^(b|d)$/.test(b)) return 'beraberlik';
  if (/^(m|l)$/.test(b)) return 'maglubiyet';
  if (/^(p|pts|puan)$/.test(b)) return 'puan';
  return null;
}

function futbolSezonu(tarih = new Date()): { tr: string; en: string } {
  const yil = tarih.getFullYear();
  const baslangic = tarih.getMonth() >= 6 ? yil : yil - 1;
  return {
    tr: `${baslangic}-${String(baslangic + 1).slice(2)}`,
    en: `${baslangic}–${String(baslangic + 1).slice(2)}`,
  };
}

/**
 * Periodically refreshes cache for feed-driven widgets (weather, prayer, market, horoscope).
 * Data sources are free / no-key APIs; API URLs & city come from the widget's config JSON.
 */
@Injectable()
export class WidgetFeederService implements OnModuleInit {
  private readonly logger = new Logger(WidgetFeederService.name);

  private readonly feeders: Record<string, Feeder> = {
    weather: this.fetchWeather.bind(this),
    'prayer-times': this.fetchPrayerTimes.bind(this),
    'market-ticker': this.fetchMarketTicker.bind(this),
    horoscope: this.fetchHoroscope.bind(this),
    newspapers: this.fetchNewspapers.bind(this),
    pharmacy: this.fetchPharmacy.bind(this),
    standings: this.fetchStandings.bind(this),
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly widgets: WidgetsService,
    @Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter,
  ) {}

  async onModuleInit() {
    // Ensure every tenant has the core feed-driven widgets, then fetch once
    // on boot so the site has fresh data immediately.
    setTimeout(async () => {
      try {
        await this.ensureCoreWidgets();
      } catch (err: any) {
        this.logger.warn(`ensureCoreWidgets failed: ${err?.message ?? err}`);
      }
      this.refreshAll().catch(() => undefined);
    }, 4000);
  }

  /**
   * Older tenants may be missing widget rows added in later releases
   * (e.g. `newspapers`). Idempotently insert them with sensible defaults so
   * cron + refresh feeders can populate their cache.
   */
  private async ensureCoreWidgets() {
    const defaults: Array<{ type: string; config: any; sortOrder: number }> = [
      { type: 'weather', config: { city: 'Kayseri' }, sortOrder: 1 },
      { type: 'prayer-times', config: { city: 'Kayseri', country: 'Turkey', method: 13 }, sortOrder: 2 },
      {
        type: 'market-ticker',
        config: {
          pairs: [
            { from: 'USD', to: 'TRY', label: 'Dolar' },
            { from: 'EUR', to: 'TRY', label: 'Euro' },
            { from: 'GBP', to: 'TRY', label: 'Sterlin' },
          ],
        },
        sortOrder: 3,
      },
      { type: 'horoscope', config: {}, sortOrder: 4 },
      { type: 'newspapers', config: {}, sortOrder: 5 },
      { type: 'pharmacy', config: { city: 'Kayseri' }, sortOrder: 6 },
      { type: 'standings', config: { ligler: VARSAYILAN_LIGLER.map((l) => l.anahtar) }, sortOrder: 7 },
    ];

    const tenants = await this.prisma.tenant.findMany({ select: { id: true } });
    for (const t of tenants) {
      for (const w of defaults) {
        const existing = await this.prisma.widget.findFirst({
          where: { tenantId: t.id, type: w.type },
          select: { id: true },
        });
        if (existing) continue;
        await this.prisma.widget.create({
          data: {
            tenantId: t.id,
            type: w.type,
            config: w.config,
            sortOrder: w.sortOrder,
            active: true,
          },
        });
        this.logger.log(`Provisioned missing widget "${w.type}" for tenant ${t.id}`);
      }
    }
  }

  // Every 30 minutes: weather, market. Prayer times once at 03:00. Horoscope at 02:00.
  @Cron(CronExpression.EVERY_30_MINUTES)
  async refreshFast() {
    await this.refreshForTypes(['weather', 'market-ticker']);
  }

  @Cron('0 3 * * *')
  async refreshPrayer() {
    await this.refreshForTypes(['prayer-times']);
  }

  @Cron('0 2 * * *')
  async refreshHoroscope() {
    await this.refreshForTypes(['horoscope']);
  }

  // Gazete manşetleri: her sabah 06:00'da güncelle (gazeteler o saatte hazır olur).
  @Cron('0 6 * * *')
  async refreshNewspapers() {
    await this.refreshForTypes(['newspapers']);
  }

  // Nöbetçi eczaneler: nöbet mesai bitiminde devrediyor. 08:30'da günün
  // listesini, 19:00'da akşam nöbetini al.
  @Cron('30 8,19 * * *')
  async refreshPharmacy() {
    await this.refreshForTypes(['pharmacy']);
  }

  /**
   * Puan durumu ve fikstür: sabah 07:00 ve akşam 23:30.
   *
   * Maçlar genelde akşam bitiyor; gece yarısına doğru tablo güncelleniyor.
   * Sabah çekimi de gece kaçırılan bir güncellemeyi telafi ediyor. Daha sık
   * çekmek kaynak siteye gereksiz yük — tablo gün içinde değişmiyor.
   */
  @Cron('0 7,23 * * *')
  async refreshStandings() {
    await this.refreshForTypes(['standings']);
  }

  async refreshAll() {
    await this.refreshForTypes(Object.keys(this.feeders));
  }

  /** Manual trigger used by admin's "refresh now" button. */
  async refreshOne(tenantId: string, type: string) {
    const feeder = this.feeders[type];
    if (!feeder) throw new NotFoundException(`"${type}" için besleyici tanımlı değil`);
    const widget = await this.widgets.findByType(tenantId, type);
    let cache: any;
    try {
      cache = await feeder(widget?.config ?? {}, widget?.cache ?? null, tenantId);
    } catch (err: any) {
      // Sebebi panele TAŞI. Çıplak `Error` Nest'te "Internal server error"a
      // dönüşüyor ve veri gelmeyen widget'ın nedeni panelden görünmüyordu.
      this.logger.warn(`refreshOne ${type} (${tenantId}) başarısız: ${err?.message ?? err}`);
      throw new ServiceUnavailableException(err?.message ?? 'Kaynak veriye ulaşılamadı');
    }
    await this.widgets.updateCache(tenantId, type, cache);
    return { ok: true, cachedAt: new Date() };
  }

  private async refreshForTypes(types: string[]) {
    const widgets = await this.prisma.widget.findMany({
      where: { active: true, type: { in: types } },
    });
    for (const w of widgets) {
      const feeder = this.feeders[w.type];
      if (!feeder) continue;
      try {
        const cache = await feeder(w.config ?? {}, w.cache ?? null, w.tenantId);
        await this.widgets.updateCache(w.tenantId, w.type, cache);
        this.logger.log(`Refreshed widget ${w.type} for tenant ${w.tenantId}`);
      } catch (err: any) {
        // Bilinçli olarak cache'e DOKUNMUYORUZ: eldeki son sağlam veri
        // kalsın, şerit boşalmasın. Bir sonraki turda tekrar denenir.
        this.logger.warn(`Failed to refresh ${w.type} (${w.tenantId}): ${err?.message ?? err}`);
      }
    }
  }

  // -------- Feeders -----------------------------------------------------

  /**
   * wttr.in – no key required, returns rich JSON.
   * Config: { city?: string }  (default: Kayseri)
   */
  private async fetchWeather(config: any) {
    const city = (config?.city as string) ?? 'Kayseri';
    const { data } = await axios.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=tr`, {
      timeout: 8000,
    });
    const current = data?.current_condition?.[0];
    const forecast = (data?.weather ?? []).slice(0, 5).map((d: any) => ({
      day: new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'short' }),
      high: d.maxtempC,
      low: d.mintempC,
      condition: d.hourly?.[4]?.lang_tr?.[0]?.value ?? d.hourly?.[4]?.weatherDesc?.[0]?.value ?? '',
    }));
    return {
      city,
      temperature: current?.temp_C ?? '—',
      condition:
        current?.lang_tr?.[0]?.value ??
        current?.weatherDesc?.[0]?.value ??
        '',
      humidity: current?.humidity,
      wind: current?.windspeedKmph,
      forecast,
    };
  }

  /**
   * Aladhan – no key, method=13 = Diyanet
   * Config: { city?: string, country?: string, method?: number }
   */
  private async fetchPrayerTimes(config: any) {
    const city = (config?.city as string) ?? 'Kayseri';
    const country = (config?.country as string) ?? 'Turkey';
    const method = (config?.method as number) ?? 13;
    const { data } = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(
        city,
      )}&country=${encodeURIComponent(country)}&method=${method}`,
      { timeout: 8000 },
    );
    const t = data?.data?.timings ?? {};
    const labels: Array<[string, string]> = [
      ['Fajr', 'İmsak'],
      ['Sunrise', 'Güneş'],
      ['Dhuhr', 'Öğle'],
      ['Asr', 'İkindi'],
      ['Maghrib', 'Akşam'],
      ['Isha', 'Yatsı'],
    ];
    return {
      city,
      date: data?.data?.date?.readable ?? '',
      hijri: data?.data?.date?.hijri?.date,
      times: labels
        .filter(([key]) => t[key])
        .map(([key, label]) => ({ name: label, time: (t[key] as string).slice(0, 5) })),
    };
  }

  /**
   * Frankfurter (döviz) — anahtar gerektirmez.
   * Config: { pairs?: [{ from, to, label }] }
   *
   * Adres notu: servis `api.frankfurter.app` → `api.frankfurter.dev/v1`
   * adresine taşındı. Eski adres 301 döndürüyor; yönlendirmeye güvenmek
   * yerine güncel adrese doğrudan gidiyoruz.
   *
   * Dayanıklılık notu: eskiden bir çifti çekemediğimizde `value: '—'`
   * yazılıyordu. Şerit `—` olan hücreleri elediği için, kaynağın tek bir
   * kötü dakikası piyasa kutucuklarının tamamen kaybolmasına yol açıyordu —
   * üstelik bir sonraki başarılı tura kadar (30 dk). Artık başarısız çiftte
   * bir önceki sağlam değer korunuyor; hiç değer yoksa çift tamamen atlanıyor.
   */
  private async fetchMarketTicker(config: any, prev?: any) {
    const pairs: Array<{ from: string; to: string; label: string }> =
      config?.pairs ?? [
        { from: 'USD', to: 'TRY', label: 'Dolar' },
        { from: 'EUR', to: 'TRY', label: 'Euro' },
        { from: 'GBP', to: 'TRY', label: 'Sterlin' },
      ];

    const prevItems: any[] = Array.isArray(prev?.items) ? prev.items : [];
    const lastGood = (code: string) => {
      const hit = prevItems.find((i) => i?.code === code);
      const v = (hit?.value ?? '').toString().trim();
      return v && v !== '—' ? hit : null;
    };

    const base = 'https://api.frankfurter.dev/v1';
    const since = new Date();
    since.setDate(since.getDate() - 3); // Frankfurter yalnızca iş günü yayınlıyor.
    const sinceDay = since.toISOString().split('T')[0];

    const settled = await Promise.all(
      pairs.map(async (p) => {
        const code = `${p.from}/${p.to}`;
        try {
          const [now, before] = await Promise.all([
            axios.get(`${base}/latest?base=${p.from}&symbols=${p.to}`, { timeout: 8000 }),
            axios.get(`${base}/${sinceDay}?base=${p.from}&symbols=${p.to}`, { timeout: 8000 }),
          ]);
          const nowValue = now.data?.rates?.[p.to];
          if (nowValue == null) throw new Error(`rate missing for ${code}`);

          const prevValue = before.data?.rates?.[p.to];
          const diff = prevValue != null ? nowValue - prevValue : 0;
          const pct = prevValue ? (diff / prevValue) * 100 : 0;
          return {
            name: p.label,
            code,
            value: nowValue.toFixed(2),
            change: pct ? `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%` : '',
            up: diff >= 0,
          };
        } catch (err: any) {
          const kept = lastGood(code);
          this.logger.warn(
            `[market] ${code} alınamadı (${err?.message ?? err}) — ` +
              (kept ? 'önceki değer korundu' : 'önceki değer de yok, atlandı'),
          );
          return kept;
        }
      }),
    );

    const items = settled.filter(Boolean);
    // Hiçbir çift gelmediyse hata fırlat: refreshForTypes bunu yakalayıp
    // cache'e hiç dokunmayacak, yani eldeki veri neyse o kalacak.
    if (items.length === 0) {
      throw new Error('market-ticker: hiçbir kur alınamadı, cache korunuyor');
    }
    return { items };
  }

  /**
   * horoscope-app-api – free, no key.
   * Signs are English lower-case; UI shows the Turkish label.
   */
  private async fetchHoroscope(_config: any) {
    // Türkçe slug → external API'nin beklediği İngilizce slug map'i.
    // Site sadece Türkçe slug'ları görür, URL'ler Türkçe kalır.
    const signs: Array<{
      name: string;
      symbol: string;
      slug: string;
      apiSlug: string;
    }> = [
      { name: 'Koç', symbol: '♈', slug: 'koc', apiSlug: 'aries' },
      { name: 'Boğa', symbol: '♉', slug: 'boga', apiSlug: 'taurus' },
      { name: 'İkizler', symbol: '♊', slug: 'ikizler', apiSlug: 'gemini' },
      { name: 'Yengeç', symbol: '♋', slug: 'yengec', apiSlug: 'cancer' },
      { name: 'Aslan', symbol: '♌', slug: 'aslan', apiSlug: 'leo' },
      { name: 'Başak', symbol: '♍', slug: 'basak', apiSlug: 'virgo' },
      { name: 'Terazi', symbol: '♎', slug: 'terazi', apiSlug: 'libra' },
      { name: 'Akrep', symbol: '♏', slug: 'akrep', apiSlug: 'scorpio' },
      { name: 'Yay', symbol: '♐', slug: 'yay', apiSlug: 'sagittarius' },
      { name: 'Oğlak', symbol: '♑', slug: 'oglak', apiSlug: 'capricorn' },
      { name: 'Kova', symbol: '♒', slug: 'kova', apiSlug: 'aquarius' },
      { name: 'Balık', symbol: '♓', slug: 'balik', apiSlug: 'pisces' },
    ];
    const results = await Promise.all(
      signs.map(async (s) => {
        let text = '';
        try {
          const { data } = await axios.get(
            `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${s.apiSlug}&day=TODAY`,
            { timeout: 8000 },
          );
          text = data?.data?.horoscope_data ?? '';
        } catch {
          // External API down — Türkçe fallback banka'ya düş
        }
        if (!text || text.trim().length === 0) {
          text = this.pickHoroscopeFallback(s.slug);
        }
        return { name: s.name, symbol: s.symbol, slug: s.slug, text };
      }),
    );
    return { signs: results, date: new Date().toISOString().split('T')[0] };
  }

  /**
   * External burç API'sı ulaşılamazsa Türkçe fallback yorumları.
   * Her burç için 12 farklı jenerik yorum — günün tarihine göre rotasyon yapar.
   * Böylece her gün farklı metin gelir, deterministik ve önyüz cache'i doğru çalışır.
   */
  private pickHoroscopeFallback(slug: string): string {
    const bank: Record<string, string[]> = {
      koc: [
        'Bugün enerjin yüksek — çevrendekilere liderlik etme fırsatı bulabilirsin. Aceleci kararlardan kaçın, düşün, sonra hareket et.',
        'İletişimde açık ol. Bugün fikirlerini net ifade edersen destek göreceksin.',
        'Fiziksel aktiviteye zaman ayır; enerjini olumluya çevirecek.',
        'İş hayatında yeni bir başlangıç için uygun bir gün. Cesaretini gösterebilirsin.',
        'Sabırsızlık seni zorlayabilir — nefes almayı unutma.',
        'Sevdiklerinle geçireceğin küçük anlar seni motive edecek.',
        'Yaratıcı bir proje bugün hayat bulabilir. Not etmeyi ihmal etme.',
        'Bugün karşına çıkan fırsatları değerlendirmek için hızlı düşünmen gerekecek.',
        'Uyku düzenine dikkat — enerjini korumak için önemli.',
        'Finansal olarak temkinli davran; küçük harcamalar birikebilir.',
        'Ekip çalışmasında öne çıkabilirsin, tartışmalardan uzak dur.',
        'Bugün bir konuda net karar vermen gerekiyor — kalbin ne diyorsa onu dinle.',
      ],
      boga: [
        'İstikrarlı adımlar bugün seni ileri taşıyacak. Rutinlerine bağlı kal.',
        'Finansal olarak dikkatli bir gün — büyük yatırım kararlarını erteleyebilirsin.',
        'Sevdiğinle geçireceğin kaliteli zaman ilişkini güçlendirir.',
        'Doğa ile temas kur — kısa bir yürüyüş bile ruhunu tazeleyecek.',
        'İş hayatında sabrın karşılığını göreceğin bir dönem.',
        'Yeme-içme alışkanlıklarına dikkat, dengeli ol.',
        'Küçük bir sürpriz seni gülümsetecek. Kabul etmekten çekinme.',
        'Sanatsal bir aktivite bugün seni rahatlatabilir.',
        'Kararsız kaldığın konuda birine danışmak faydalı olur.',
        'Ev düzenine el atmak için ideal bir gün.',
        'Kendine güven — yaptığın işin kalitesini herkes fark ediyor.',
        'Küçük hediyeler büyük mutluluklar getirir; sen de birine bir jest yapabilirsin.',
      ],
      ikizler: [
        'İletişim gücün bugün zirvede — sunumlarında dikkat çekeceksin.',
        'Yeni insanlarla tanışma fırsatların olacak; sosyal ol.',
        'Bir konuyu araştırırken beklenmedik bilgiler seni şaşırtabilir.',
        'İki farklı konuya bölünmüş gibi hissedebilirsin — öncelik belirle.',
        'Öğrenmeye açık bir gün; bir kurs veya kitap ilgini çekebilir.',
        'Sözlerine dikkat — yanlış anlaşılmaya açık bir gün.',
        'Yaratıcı yazıya, bloglamaya vakit ayır.',
        'Kısa yolculuklar bugün seni tazeleyebilir.',
        'Meraklı doğan hayrına bir sırrı çözebilirsin.',
        'Bugün esneklik senin gücün olacak.',
        'Fikirlerin yankı bulacak; sunumu ihmal etme.',
        'Kendine küçük bir mola ver — beynin dinlensin.',
      ],
      yengec: [
        'Duygusal olarak dolu bir gün — sevdiklerine sarıl.',
        'Ev, aile ve köklerin bugün önemli olacak.',
        'Sezgilerin kuvvetli — karar verirken içindeki sese güven.',
        'Küçük bir jest sevdiğini mutlu edecek.',
        'Geçmişten bir haber seni etkileyebilir; sakin ol.',
        'Kendine bakım yap — bir bakım günü hak ediyorsun.',
        'Bir konuda hassas olabilirsin; sınırlarını koru.',
        'Sanata, müziğe ve rahatlatan aktivitelere zaman ayır.',
        'Yeni bir yemek denemek keyifli olabilir.',
        'Aile içi iletişim önemli; anlayışlı ol.',
        'Ruhsal olarak beslemek için doğaya çık.',
        'Kararlı ama nazik olmak bugünün anahtarı.',
      ],
      aslan: [
        'Bugün parlama sırası sende — sahne senin.',
        'Yaratıcılığın gündemde; yeni bir proje başlatabilirsin.',
        'Liderlik yeteneğin ekibinde etkili olacak.',
        'Bir konuda cesaret göstermen gerekebilir; içindeki güce güven.',
        'İltifatları kabul etmeyi öğren — sen bunu hak ediyorsun.',
        'Aşk hayatında romantik bir jest yakın.',
        'Sahne sanatlarıyla ilgili bir davet alabilirsin.',
        'Kendine yeni bir stil deneyebilirsin — değişim iyi gelir.',
        'Sosyal medyada paylaştıkların büyük etkileşim alabilir.',
        'Küçük bir başarı büyük bir moral verecek.',
        'Egodan uzak dur; alçakgönüllülük daha çekici.',
        'Bugün cömertliğin sana geri dönecek.',
      ],
      basak: [
        'Detaylara olan hakimiyetin bugün seni öne çıkaracak.',
        'Bir projeyi bitirme fırsatın olabilir; disiplinli çalış.',
        'Sağlığına dikkat — düzenli beslenme ve su içmeyi ihmal etme.',
        'Analiz gücün seni doğru karara götürecek.',
        'Kendine haddinden fazla yüklenme; dinlenmeye zaman ayır.',
        'İş yerinde bir düzenlemeye ihtiyaç duyabilirsin.',
        'Küçük bir sağlık kontrolü fena olmaz.',
        'Yardımseverliğin bir çevrene iyi gelecek.',
        'Yapılacaklar listeni gözden geçir — bazı maddeler artık gerekli değil.',
        'Titiz yaklaşımın bir sorunu çözmene yardım edecek.',
        'Bugün sadece kendine odaklan — “hayır” demek de bir yetenek.',
        'Yeni bir hobi başlatmak için doğru zaman.',
      ],
      terazi: [
        'Denge bugün senin en büyük müttefikin.',
        'İkili ilişkilerde tatlı sürprizler olabilir.',
        'Bir karar vermen gerekiyor; her iki tarafı da dinle.',
        'Estetik zevkin gündeme gelecek — belki bir alışveriş?',
        'Adaletli olmak seni doğru yere götürür.',
        'Uzlaşma sanatın bugün konuşulacak.',
        'Sanatsal bir etkinliğe katılmak seni besleyecek.',
        'Renkli kıyafetler bugün moralini yükseltir.',
        'Bir arkadaş sana danışacak; empatik ol.',
        'Kısa bir gezinti stresini alacak.',
        'Aşkta ince bir hamle bekleniyor — hazırlıklı ol.',
        'Uyumlu bir gün için önce kendinle barışık ol.',
      ],
      akrep: [
        'Sezgilerin bugün fena yanıltmayacak; onlara güven.',
        'Bir sırrın açığa çıkması söz konusu — sakin karşıla.',
        'Tutkulu bir gün seni bekliyor.',
        'Derinliklerine yolculuk yaparsan aydınlanabilirsin.',
        'İnatçı olmak yerine esnek ol; kazançlı çıkarsın.',
        'Finansal konularda gizli bir fırsat çıkabilir.',
        'İlişkilerde derin sohbetler seni yakınlaştıracak.',
        'Kendini yenilemek için köklü bir değişiklik düşünebilirsin.',
        'Yaratıcı yazıya ilgi duyabilirsin.',
        'Bir konuda kararsızsan içgüdünü izle.',
        'Yoğun duygular seni etkileyebilir; nefes al ve gözlemle.',
        'Karizman bugün etkileyici — kullanmayı bil.',
      ],
      yay: [
        'Özgürlük hissi seni yeni ufuklara çekiyor.',
        'Kısa bir seyahat planı yapabilirsin.',
        'Öğrenme aşkın bugün alevlenebilir; bir kitap veya belgesel öner.',
        'İyimserliğin çevrendekileri de motive edecek.',
        'Bir hedefine bugün büyük bir adım atabilirsin.',
        'Espri anlayışın seni sevimli kılıyor — abartma ama.',
        'Yaban doğaya çıkmak için ideal bir gün.',
        'Farklı kültürlerden birileriyle tanışmak ilham verir.',
        'Sözleşme veya iş anlaşmalarına dikkat — küçük yazıyı da oku.',
        'Yeni bir dil öğrenmeye başlayabilirsin.',
        'Cömertliğin karşılık bulacak.',
        'Bugün açık ol — yeni fırsatlar geliyor.',
      ],
      oglak: [
        'Disiplin ve azmin bugün karşılık bulacak.',
        'Kariyer hedeflerine odaklan — bir adım öne çık.',
        'Sorumlulukların ağır gelebilir; delege etmeyi öğren.',
        'İstikrarlı adımlar seni uzağa götürür.',
        'Aile büyüklerinden gelen tavsiye değerli olabilir.',
        'Yatırım kararlarını iyice araştır.',
        'Kendine mola ver — verimlilik böyle korunur.',
        'Uzun soluklu bir proje bugün ivme kazanabilir.',
        'Ciddiyetin dışında bir esprili yön göster — hoşuna gidecek.',
        'Kariyer ilişkilerinde köprüler kurmaya devam et.',
        'Sabırlı olmak bugünün altın kuralı.',
        'Kendi sınırlarını çiziyorsun; bu sağlıklı bir adım.',
      ],
      kova: [
        'Vizyoner düşüncelerin bugün gündeme gelebilir.',
        'Bir grup çalışmasında farklı bir bakış açısı sunacaksın.',
        'Teknolojik bir yenilik ilgini çekebilir.',
        'Arkadaşlarınla vakit geçirmek moralini yükseltir.',
        'Bağımsızlığına önem verdiğin bir gün.',
        'Yeni bir sosyal proje aklında olabilir.',
        'Alışılmadık bir çözüm bir sorunu çözebilir.',
        'İnsan hakları veya sosyal konular seni harekete geçirebilir.',
        'Kendine özgür alan yaratmak için evini yeniden düzenle.',
        'İlham veren biriyle karşılaşabilirsin.',
        'Değişime açık ol — bir kapı kapanırken bir kapı açılıyor.',
        'Bugün duygularını da tanı; sadece mantıkla yetinme.',
      ],
      balik: [
        'Hayal gücün bugün taşabilir; not almayı unutma.',
        'Empati yeteneğin biri için can simidi olabilir.',
        'Sanatsal, sezgisel bir gün — yaratıcı bir şeyle uğraş.',
        'Rüyaların sana mesaj veriyor olabilir; not al.',
        'Suyla ilişkili aktiviteler seni rahatlatır.',
        'Kendini fazla kaptırma — sınırlarını koru.',
        'Bir arkadaşın samimi bir sohbete ihtiyacı olabilir.',
        'Müzik, film, kitap — sanatla iç içe ol.',
        'Meditasyon veya nefes egzersizleri iyi gelecek.',
        'Sezgilerin yanıltmadı; onlara güvenmeye devam.',
        'Kendine karşı da anlayışlı ol.',
        'Aşk hayatında romantik bir sürpriz yakın.',
      ],
    };
    const arr = bank[slug];
    if (!arr || arr.length === 0) return '';
    // Günün gününe göre deterministik seç — her gün farklı yorum.
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    return arr[dayOfYear % arr.length];
  }

  /**
   * Gazete manşetleri — gazeteoku.com/gazeteler sayfasından günlük kapakları alır.
   *
   * Sayfa yapısı (2026-08 itibarıyla doğrulandı):
   *   .newspapers a[href$="-manseti"]
   *     ├─ <strong>HÜRRİYET</strong>          → ad (büyük harf)
   *     ├─ <small>11 Ağustos 2026</small>     → tarih
   *     └─ <img src="blank.png" data-src="…"> → kapak (LAZY: gerçek URL data-src'de)
   *
   * Görsel URL'i `/3/{w}/{h}/storage/…` biçiminde boyut taşır. Boyut
   * segmenti tamamen atılınca kaynağın ORİJİNALİ gelir: 1280x~2150, ~1 MB.
   * Bu hem en yüksek çözünürlük hem de kırpılmamış tam sayfa —
   * `/3/1240/1754/` varyantı A4 oranına zorlayıp gazetenin altını kesiyor.
   * 1240 üzeri boyut istekleri kaynak tarafından 422 ile reddediliyor.
   */
  /**
   * Gazete kapaklarını kaynak sitedeki adresten indirip kendi bucket'ımıza
   * yazar ve cache'e kendi CDN adresimizi koyar.
   *
   * Neden: kapaklar `i.gazeteoku.com` üzerinden geliyordu — anasayfada 17
   * ayrı dış istek, her biri ~500 ms TTFB, üstelik bizim önbellek
   * kurallarımızın ve erişilebilirliğimizin tamamen dışında. Kaynak site
   * yavaşlarsa ya da görselleri silerse şerit bozuluyordu.
   *
   * Anahtar `put()` içinde UUID ile üretiliyor; yani her gün yeni adres
   * çıkıyor. Bu kasıtlı — CDN'de 1 yıllık `immutable` önbellek var, sabit
   * bir adres kullansaydık dünkü kapak bir yıl boyunca donardı.
   *
   * Aynalama başarısız olursa o gazete kaynak adresiyle bırakılır: şerit
   * eksik görünmektense dış adresten yüklensin.
   */
  /**
   * BİR TUR İÇİNDE aynı kapağı bir kez indirir.
   *
   * Aynalama kiracı başına yapılıyor (her kiracının kendi bucket'ı var), ama
   * kaynaktan indirme kiracıya bağlı değil. 10 kiracı × 30 kapak = kaynağa
   * 300 istek demekti; kaynak site bir noktada kısıtlamaya başlıyor ve sıranın
   * sonundaki kiracılar boş şeritle kalıyordu.
   */
  private kapakOnbellek = new Map<string, { buffer: Buffer; mimeType: string }>();

  private async kapakIndir(adres: string) {
    const hazir = this.kapakOnbellek.get(adres);
    if (hazir) return hazir;

    const res = await axios.get<ArrayBuffer>(adres, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: SCRAPE_HEADERS,
      maxContentLength: 8 * 1024 * 1024,
    });
    const kayit = {
      buffer: Buffer.from(res.data),
      mimeType: (res.headers['content-type'] as string) || 'image/jpeg',
    };
    this.kapakOnbellek.set(adres, kayit);
    return kayit;
  }

  private async mirrorNewspaperCovers(items: any[], tenantId?: string) {
    if (!tenantId || items.length === 0) return items;

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { mediaBaseUrl: true },
    });

    let ok = 0;
    const out = await Promise.all(
      items.map(async (it) => {
        // Kaynağın TAM BOY kapağını indir: manşet okunabilir olsun.
        // Eskiden `it.image` (230x336 vesikalık) indirilip `imageFull` de ona
        // işaret ediyordu; okuma modalı o minik görseli büyütmeye çalışıyor ve
        // gazete okunamıyordu. Küçük kart görselini aşağıda bu tek indirmeden
        // üretiyoruz — kaynağa ikinci istek yok.
        const source = (it.imageFull ?? it.image ?? '').trim();
        if (!source) return it;
        try {
          const { buffer } = await this.kapakIndir(source);

          const tamBoy = await sharp(buffer)
            // 1240 kaynağın sunduğu en büyük kullanışlı genişlik; üstü
            // yalnızca dosyayı büyütür, yeni detay getirmez.
            .resize({ width: 1240, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toBuffer();

          // Şeritteki kart en fazla ~190 CSS px; 460 retina için yeterli.
          const kucuk = await sharp(buffer)
            .resize({ width: 460, withoutEnlargement: true })
            .webp({ quality: 72 })
            .toBuffer();

          const ad = it.slug || 'kapak';
          const [buyukKayit, kucukKayit] = await Promise.all([
            this.storage.put({
              tenantId,
              filename: `gazete-${ad}-tam.webp`,
              mimeType: 'image/webp',
              size: tamBoy.length,
              buffer: tamBoy,
              publicBaseUrl: tenant?.mediaBaseUrl ?? null,
            }),
            this.storage.put({
              tenantId,
              filename: `gazete-${ad}.webp`,
              mimeType: 'image/webp',
              size: kucuk.length,
              buffer: kucuk,
              publicBaseUrl: tenant?.mediaBaseUrl ?? null,
            }),
          ]);
          ok++;
          return {
            ...it,
            image: kucukKayit.url,
            imageFull: buyukKayit.url,
            sourceImage: source,
          };
        } catch (err: any) {
          this.logger.warn(
            `[newspapers] "${it.name}" kapağı aynalanamadı (${err?.message ?? err}) — kaynak adres korundu`,
          );
          return it;
        }
      }),
    );

    this.logger.log(`[newspapers] ${ok}/${items.length} kapak kendi CDN'imize aynalandı`);
    return out;
  }

  /**
   * Taranan kapak listesi — kiracılar arasında paylaşılıyor.
   *
   * `refreshForTypes` her kiracı için besleyiciyi ayrı çağırıyor; kaynak sayfa
   * ise kiracıya göre değişmiyor. Kısa ömürlü bu önbellek olmadan bir tur
   * kaynağa kiracı sayısı kadar istek atıyor ve kısıtlamaya takılıyor.
   */
  private gazeteOnbellek: { zaman: number; items: KapakOgesi[] } | null = null;

  /** 15 dakika: bir yenileme turu için bol, gün içinde taze kalması için kısa. */
  private static readonly GAZETE_ONBELLEK_MS = 15 * 60 * 1000;

  private async gazeteKapaklariniTara(): Promise<KapakOgesi[]> {
    const hazir = this.gazeteOnbellek;
    if (hazir && Date.now() - hazir.zaman < WidgetFeederService.GAZETE_ONBELLEK_MS) {
      return hazir.items;
    }

    const items = await this.gazeteKapaklariniIndir();
    this.gazeteOnbellek = { zaman: Date.now(), items };
    // Kapak gövdeleri yalnızca bu tur boyunca gerekli; bellekte tutmanın
    // anlamı yok (30 kapak ≈ 30 MB).
    this.kapakOnbellek.clear();
    return items;
  }

  /**
   * Kapakları SIRAYLA kaynaklardan dener; ilk dolu liste kazanır.
   * Aynalama YAPMAZ — o adım kiracıya özel (her kiracının kendi bucket'ı var).
   *
   * Neden sıra: kaynaklar bizi engelleyebiliyor. gazeteoku.com sunucumuzun
   * IP'sine 403 verdi (ev bağlantısından 200) ve şerit günlerce boş kaldı.
   * Tek kaynağa bağlı olmak o günü tamamen kaybettiriyor.
   */
  private async gazeteKapaklariniIndir(): Promise<KapakOgesi[]> {
    const hatalar: string[] = [];

    for (const kaynak of GAZETE_KAYNAKLARI) {
      try {
        const html = await this.sayfayiIndir(kaynak.url);
        const bulunan = kaynak.ayikla(cheerio.load(html));
        const tekil = tekilKapaklar(bulunan);

        if (tekil.length === 0) {
          // Sayfa geldi ama hiçbir kapak çıkmadı: kaynağın işaretçileri
          // değişmiş. Sonraki kaynağa geç, sessizce boş liste yazma.
          hatalar.push(`${kaynak.ad}: 0 kapak (işaretçiler değişmiş olabilir)`);
          this.logger.warn(
            `[newspapers] ${kaynak.ad} 0 kapak döndürdü — işaretçiler eskimiş olabilir (${kaynak.secici})`,
          );
          continue;
        }

        this.logger.log(`[newspapers] ${tekil.length} kapak alındı — kaynak: ${kaynak.ad}`);
        return tekil.slice(0, 40);
      } catch (err: any) {
        hatalar.push(`${kaynak.ad}: ${err?.message ?? err}`);
        this.logger.warn(`[newspapers] ${kaynak.ad} kaynağı düştü: ${err?.message ?? err}`);
      }
    }

    throw new Error(`Hiçbir kaynaktan kapak alınamadı — ${hatalar.join(' | ')}`);
  }

  private async fetchNewspapers(_config: any, prev?: any, tenantId?: string) {
    try {
      const kapaklar = await this.gazeteKapaklariniTara();
      const mirrored = await this.mirrorNewspaperCovers(kapaklar, tenantId);

      return {
        items: mirrored,
        source: kapaklar[0]?.source ?? GAZETE_KAYNAKLARI[0].url,
        date: new Date().toISOString().split('T')[0],
      };
    } catch (err: any) {
      const sebep = err?.message ?? String(err);
      this.logger.warn(`[newspapers] fetch failed: ${sebep}`);

      /**
       * ÖNBELLEĞİ BOŞALTMA. Eskiden burada `{ items: [] }` dönülüyordu ve o
       * boş liste önbelleğe yazılıyordu; tek bir başarısız çekim şeridi
       * anasayfadan tamamen siliyordu (bölüm 0 kapakta `null` basıyor).
       * Hata fırlatınca `refreshForTypes` önbelleğe dokunmuyor: dünün
       * kapakları, bugünün çekimi düzelene kadar ekranda kalıyor.
       */
      if (prev?.items?.length) {
        throw new Error(`${sebep} — önceki ${prev.items.length} kapak korundu`);
      }
      throw new Error(sebep);
    }
  }

  /**
   * Bot filtresine takılan sayfaları indirir: gerçek bir tarayıcının başlık
   * setiyle, üç denemeye kadar, artan beklemeyle.
   *
   * Neden gerekli: kapak kaynağı tek bir isteği geçici olarak 403/503 ile
   * çevirdiğinde ya da bağlantı zaman aşımına düştüğünde günün tamamı
   * kaybediliyordu — sonraki deneme ancak yarın sabahki cron'da.
   */
  private async sayfayiIndir(url: string, deneme = 3): Promise<string> {
    const kaynak = new URL(url);
    let sonHata: any;

    for (let i = 1; i <= deneme; i++) {
      try {
        const { data } = await axios.get<string>(url, {
          timeout: 20000,
          responseType: 'text',
          // Referer ve sec-fetch-* başlıkları: kaynak siteler doğrudan
          // (refererı olmayan) istekleri bot sayıp 403 döndürebiliyor.
          headers: {
            ...SCRAPE_HEADERS,
            Referer: `${kaynak.protocol}//${kaynak.host}/`,
            'sec-fetch-dest': 'document',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-user': '?1',
            'Cache-Control': 'no-cache',
          },
        });
        return data;
      } catch (err: any) {
        sonHata = err;
        const durum = err?.response?.status;
        this.logger.warn(
          `[scrape] ${url} denemesi ${i}/${deneme} başarısız` +
            `${durum ? ` (HTTP ${durum})` : ''}: ${err?.code ?? err?.message ?? err}`,
        );
        // Bu durumlar kararlı: sayfa yok (404) ya da kaynak bizi istemiyor
        // (401/403/451). Tekrar denemek yalnızca yedek kaynağa geçişi
        // geciktiriyor — prodda 403 alan kaynak her denemede 403 veriyor.
        if (durum && [401, 403, 404, 451].includes(durum)) break;
        if (i < deneme) await new Promise((r) => setTimeout(r, i * 2000));
      }
    }

    const durum = sonHata?.response?.status;
    throw new Error(
      `${url} indirilemedi${durum ? ` (HTTP ${durum})` : ''}: ` +
        `${sonHata?.code ?? sonHata?.message ?? sonHata}`,
    );
  }

  /**
   * Nöbetçi eczaneler — eczaneler.gen.tr'den şehrin günlük nöbet listesi.
   * Sayfa gün sekmelerine ayrılmış: #nav-bugun / #nav-yarin. "Bugün"
   * sekmesi boşsa (gece yarısından sonra site sekmeleri kaydırır) yarına düşer.
   * Config: { city?: string }  (varsayılan: Kayseri)
   */

  /**
   * Puan durumu (Wikipedia) + fikstür (TFF).
   *
   * Her lig ayrı ayrı çekiliyor ve BİRİ ÇÖKSE DİĞERLERİ ETKİLENMİYOR: bir
   * ligin sayfası değişirse yalnızca o sekme eski veride kalıyor, tablo
   * tamamen boşalmıyor. Elde sağlam veri varken onu bozmamak, `prev`
   * mekanizmasının kurulma sebebi.
   */
  private async fetchStandings(config: any, prev?: any) {
    const istenen: string[] = Array.isArray(config?.ligler) && config.ligler.length
      ? config.ligler
      : VARSAYILAN_LIGLER.map((l) => l.anahtar);

    const ligler = VARSAYILAN_LIGLER.filter((l) => istenen.includes(l.anahtar));
    const oncekiler: Record<string, any> = {};
    for (const l of prev?.ligler ?? []) oncekiler[l.anahtar] = l;

    const sonuclar = await Promise.all(
      ligler.map(async (lig) => {
        try {
          // Fikstür AYRI ele alınıyor: TFF sayfası çökerse puan durumu da
          // gitmesin. İlk sürümde ikisi tek `Promise.all` içindeydi ve TFF
          // hatası yüzünden Türkiye liglerinin tablosu hiç görünmüyordu —
          // asıl veri sağlamken yan veri onu da düşürüyordu.
          const puanDurumu = await this.wikipediaPuanDurumu(lig);
          const fikstur = lig.tffSayfa
            ? await this.tffFikstur(lig).catch((err: any) => {
                this.logger.warn(
                  `standings: ${lig.ad} fikstürü alınamadı — ${err?.message ?? err}`,
                );
                return [] as any[];
              })
            : [];

          // Tablo boş geldiyse eldeki veriyi koru — kaynak geçici olarak
          // bozulmuş olabilir ve boş bir tablo göstermek daha kötü.
          if (puanDurumu.length === 0 && oncekiler[lig.anahtar]) {
            this.logger.warn(`standings: ${lig.ad} boş döndü, önceki veri korunuyor`);
            return oncekiler[lig.anahtar];
          }

          return {
            anahtar: lig.anahtar,
            ad: lig.ad,
            puanDurumu,
            fikstur,
            guncellendi: new Date().toISOString(),
          };
        } catch (err: any) {
          this.logger.warn(`standings: ${lig.ad} alınamadı — ${err?.message ?? err}`);
          return oncekiler[lig.anahtar] ?? null;
        }
      }),
    );

    return { ligler: sonuclar.filter(Boolean), guncellendi: new Date().toISOString() };
  }

  /**
   * Wikipedia sezon sayfasından puan durumu tablosu.
   *
   * Tabloyu sınıfa göre değil BAŞLIKLARINA göre buluyoruz: sayfada onlarca
   * `wikitable` var (kadro, teknik direktör değişiklikleri, sonuç matrisi) ve
   * hangisinin kaçıncı sırada olduğu ligden lige değişiyor. Başlıkta hem
   * "Takım" hem "O/G/B/M" geçen tek tablo puan durumudur.
   */
  private async wikipediaPuanDurumu(lig: LigTanimi) {
    const sezon = futbolSezonu();
    const adaylar = [
      lig.wiki.replace('{SEZON}', lig.wikiDil === 'tr' ? sezon.tr : sezon.en),
      // Yeni sezon sayfası henüz açılmamışsa bir öncekine düş.
      lig.wiki.replace(
        '{SEZON}',
        lig.wikiDil === 'tr'
          ? futbolSezonu(new Date(Date.now() - 365 * 864e5)).tr
          : futbolSezonu(new Date(Date.now() - 365 * 864e5)).en,
      ),
    ];

    for (const sayfa of adaylar) {
      const url = `https://${lig.wikiDil}.wikipedia.org/wiki/${encodeURIComponent(sayfa)}`;
      const { data: html } = await axios.get<string>(url, {
        timeout: 20000,
        headers: SCRAPE_HEADERS,
        responseType: 'text',
        validateStatus: (s) => s === 200 || s === 404,
      });
      if (!html || html.length < 1000) continue;

      const $ = cheerio.load(html);
      let satirlar: any[] = [];

      $('table.wikitable').each((_i, tablo) => {
        if (satirlar.length > 0) return;
        // Başlık satırındaki hücreleri alan adlarına eşle.
        const basliklar = $(tablo)
          .find('tr')
          .first()
          .find('th,td')
          .map((_j, c) => $(c).text().trim())
          .get();
        const harita: Record<string, number> = {};
        basliklar.forEach((b, i) => {
          const alan = puanSutunu(b);
          if (alan && harita[alan] === undefined) harita[alan] = i;
        });
        // Takım ve puan sütunu olmayan tablo puan durumu değildir (kadro,
        // teknik direktör değişiklikleri, sonuç matrisi hep `wikitable`).
        if (harita.takim === undefined || harita.puan === undefined) return;

        const bulunan: any[] = [];
        $(tablo)
          .find('tr')
          .slice(1)
          .each((_j, tr) => {
            // `th` ve `td` BİRLİKTE, belge sırasında: takım adı bazı
            // tablolarda th, bazılarında td.
            const hucreler = $(tr)
              .find('th,td')
              .map((_k, c) => $(c).text().replace(/\s+/g, ' ').trim())
              .get();
            if (hucreler.length < basliklar.length - 2) return;
            const al = (ad: string) => hucreler[harita[ad]] ?? '';
            const sayi = (ad: string) =>
              Number((al(ad) || '').replace(/[^0-9-]/g, '')) || 0;
            const takim = al('takim').replace(/\(.*?\)/g, '').trim();
            // Sadece sayıdan oluşan "takım" = yanlış sütuna denk geldik.
            if (!takim || /^\d+$/.test(takim)) return;
            bulunan.push({
              sira: bulunan.length + 1,
              takim,
              oynadi: sayi('oynadi'),
              galibiyet: sayi('galibiyet'),
              beraberlik: sayi('beraberlik'),
              maglubiyet: sayi('maglubiyet'),
              puan: sayi('puan'),
            });
          });

        if (bulunan.length >= 4) satirlar = bulunan;
      });

      if (satirlar.length > 0) return satirlar;
    }
    return [];
  }

  /**
   * TFF sayfasından bu haftanın maçları.
   *
   * Yalnızca Türkiye ligleri için var; Avrupa ligleri için ücretsiz ve
   * anahtarsız bir fikstür kaynağı bulunamadı ve uydurmak yerine boş
   * bırakıyoruz — site o ligde fikstür sekmesini hiç göstermiyor.
   */
  /**
   * TFF sayfasından bu haftanın maçları.
   *
   * İKİ TUZAK VAR, ikisi de deneyerek bulundu:
   *
   * 1. Sayfa `windows-1254` kodlu, UTF-8 değil. UTF-8 varsayınca takım
   *    adları "GALATASARAY A.�." gibi bozuluyor.
   * 2. `<table>` ile `<tr>` arasına `<div>` konmuş — geçersiz iç içe geçme.
   *    Hoşgörülü HTML ayrıştırıcıları bu satırları tablodan dışarı taşıyor
   *    ve seçiciler hiçbir şey bulamıyor. Bu yüzden burada cheerio yerine
   *    doğrudan metin üzerinde çalışıyoruz; TFF'nin sınıf adları sabit.
   *
   * Yalnızca Türkiye ligleri için var; Avrupa ligleri için ücretsiz ve
   * anahtarsız bir fikstür kaynağı bulunamadı ve uydurmak yerine boş
   * bırakılıyor — site o ligde fikstür sekmesini göstermiyor.
   */
  private async tffFikstur(lig: LigTanimi) {
    const url = `https://www.tff.org/Default.aspx?pageId=${lig.tffSayfa}`;
    const { data } = await axios.get<ArrayBuffer>(url, {
      timeout: 20000,
      headers: SCRAPE_HEADERS,
      responseType: 'arraybuffer',
      // Yalnızca bu istek için: eksik sertifika zinciri (bkz. TFF_AGENT).
      httpsAgent: TFF_AGENT,
    });
    const html = iconv.decode(Buffer.from(data), 'windows-1254');

    const maclar: any[] = [];
    const bloklar = html.split('class="haftaninMaclariTr"').slice(1);

    for (const blok of bloklar) {
      const yakala = (desen: RegExp) => blok.match(desen)?.[1]?.trim() ?? '';
      const tarih = yakala(/lblTarih[^>]*>([^<]+)/);
      const saat = yakala(/lblSaat[^>]*>([^<]+)/);
      const evSahibi = yakala(/haftaninMaclariEv"[\s\S]{0,600}?<span[^>]*>([^<]+)/);
      const deplasman = yakala(
        /haftaninMaclariDeplasman"[\s\S]{0,600}?<span[^>]*>([^<]+)/,
      );
      if (!evSahibi || !deplasman) continue;

      /*
       * SKOR ALINMIYOR — bilinçli.
       *
       * Skor hücresi iç içe geçmiş bağlantı/span yapısında ve iki golden
       * yalnızca biri güvenilir biçimde çıkarılabiliyordu. "2 - 1" yerine
       * "2" göstermek yanlış bilgi olurdu; yarım skor hiç skordan kötüdür.
       * Fikstür sekmesinin ihtiyacı zaten oynanacak maçlar: tarih, saat ve
       * takımlar.
       */
      maclar.push({ tarih, saat, evSahibi, deplasman });
    }

    return maclar.slice(0, 12);
  }

  private async fetchPharmacy(config: any) {
    const city = (config?.city as string) ?? 'Kayseri';
    const citySlug = slugify(city, { lower: true, strict: true, locale: 'tr' });
    const url = `https://www.eczaneler.gen.tr/nobetci-${citySlug}`;

    try {
      const { data: html } = await axios.get(url, {
        timeout: 15000,
        headers: SCRAPE_HEADERS,
        responseType: 'text',
      });
      const $ = cheerio.load(html);

      const parseTab = (tabId: string) => {
        const rows: Array<{
          name: string;
          address: string;
          district: string;
          phone: string;
        }> = [];

        $(`${tabId} table tr`).each((_, tr) => {
          const $row = $(tr).find('.row').first();
          if (!$row.length) return; // başlık satırı

          const name = $row.find('.isim').first().text().trim();
          if (!name) return;

          // Adres: ikinci kolonun düz metni — ilçe etiketi ve yol tarifi
          // satırı çıkarılır.
          const $addrCol = $row.find('[class*="col-lg-6"]').first();
          const district = $addrCol.find('.my-2 span').first().text().trim();
          const address = $addrCol
            .clone()
            .find('.my-2')
            .remove()
            .end()
            .text()
            .replace(/\s*→[\s\S]*$/, '') // "→ tarif" açıklamasını at
            .replace(/\s+/g, ' ')
            .trim();

          const phone = $row.find('[class*="col-lg-3"]').last().text().trim();

          rows.push({ name, address, district, phone });
        });

        return rows;
      };

      // "Bugün" sekmesi boşsa yarını dene — bazı saatlerde site aktif
      // sekmeyi kaydırıyor ve bugün boş kalıyor.
      let pharmacies = parseTab('#nav-bugun');
      let scope: 'today' | 'tomorrow' = 'today';
      if (pharmacies.length === 0) {
        pharmacies = parseTab('#nav-yarin');
        scope = 'tomorrow';
      }

      if (pharmacies.length === 0) {
        this.logger.warn(
          `[pharmacy] ${url} scrape returned 0 items — selectors may be outdated`,
        );
      }

      return {
        city,
        scope,
        source: url,
        date: new Date().toISOString().split('T')[0],
        pharmacies,
      };
    } catch (err: any) {
      this.logger.warn(`[pharmacy] fetch failed (${url}): ${err?.message ?? err}`);
      return {
        city,
        scope: 'today' as const,
        source: url,
        date: new Date().toISOString().split('T')[0],
        pharmacies: [],
      };
    }
  }
}
