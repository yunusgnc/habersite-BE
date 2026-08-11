import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { PrismaService } from '../prisma/prisma.service';
import { WidgetsService } from './widgets.service';

type Feeder = (config: any) => Promise<any>;

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
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly widgets: WidgetsService,
  ) {}

  async onModuleInit() {
    // Fetch once on boot so the site has fresh data immediately.
    setTimeout(() => this.refreshAll().catch(() => undefined), 4000);
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

  async refreshAll() {
    await this.refreshForTypes(Object.keys(this.feeders));
  }

  /** Manual trigger used by admin's "refresh now" button. */
  async refreshOne(tenantId: string, type: string) {
    const feeder = this.feeders[type];
    if (!feeder) throw new Error(`No feeder registered for widget type: ${type}`);
    const widget = await this.widgets.findByType(tenantId, type);
    const cache = await feeder(widget?.config ?? {});
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
        const cache = await feeder(w.config ?? {});
        await this.widgets.updateCache(w.tenantId, w.type, cache);
        this.logger.log(`Refreshed widget ${w.type} for tenant ${w.tenantId}`);
      } catch (err: any) {
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
   * Frankfurter (döviz) — no key.
   * Config: { pairs?: [{ from, to, label }] }
   */
  private async fetchMarketTicker(config: any) {
    const pairs: Array<{ from: string; to: string; label: string }> =
      config?.pairs ?? [
        { from: 'USD', to: 'TRY', label: 'Dolar' },
        { from: 'EUR', to: 'TRY', label: 'Euro' },
        { from: 'GBP', to: 'TRY', label: 'Sterlin' },
      ];

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 3); // Frankfurter is business-days only

    const items = await Promise.all(
      pairs.map(async (p) => {
        try {
          const [now, prev] = await Promise.all([
            axios.get(`https://api.frankfurter.app/latest?from=${p.from}&to=${p.to}`, {
              timeout: 8000,
            }),
            axios.get(
              `https://api.frankfurter.app/${
                yesterday.toISOString().split('T')[0]
              }?from=${p.from}&to=${p.to}`,
              { timeout: 8000 },
            ),
          ]);
          const nowValue = now.data?.rates?.[p.to];
          const prevValue = prev.data?.rates?.[p.to];
          const diff = nowValue != null && prevValue != null ? nowValue - prevValue : 0;
          const pct = prevValue ? (diff / prevValue) * 100 : 0;
          return {
            name: p.label,
            code: `${p.from}/${p.to}`,
            value: nowValue != null ? nowValue.toFixed(2) : '—',
            change: pct ? `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%` : '',
            up: diff >= 0,
          };
        } catch {
          return { name: p.label, code: `${p.from}/${p.to}`, value: '—', change: '', up: true };
        }
      }),
    );
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
        try {
          const { data } = await axios.get(
            `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${s.apiSlug}&day=TODAY`,
            { timeout: 8000 },
          );
          return {
            name: s.name,
            symbol: s.symbol,
            slug: s.slug,
            text: data?.data?.horoscope_data ?? '',
          };
        } catch {
          return { name: s.name, symbol: s.symbol, slug: s.slug, text: '' };
        }
      }),
    );
    return { signs: results, date: new Date().toISOString().split('T')[0] };
  }

  /**
   * Gazete manşetleri — gazeteoku.com'dan günlük gazete kapaklarını scrape eder.
   * Ana ulusal gazetelerin ön yüzlerini toplar. Site fullscreen görüntüleyici ile
   * kullanır. Kaynak site değişirse selector'ları güncelle.
   */
  private async fetchNewspapers(_config: any) {
    try {
      const { data: html } = await axios.get('https://www.gazeteoku.com/', {
        timeout: 15000,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
        },
      });
      const $ = cheerio.load(html);
      const items: Array<{ name: string; slug: string; image: string; url: string }> = [];

      // gazeteoku.com her gazete için `.item` veya benzeri kart yapısı kullanır.
      // Sayfa yapısı değişebilir — bu selector'ları güncel tutmak gerekir.
      $('a.gazete, .gazete-item a, .newspaper-card a').each((_, el) => {
        const $el = $(el);
        const img = $el.find('img').attr('src') || $el.find('img').attr('data-src') || '';
        const name = $el.find('.gazete-adi, .newspaper-name, h3, .title').first().text().trim() ||
                     $el.attr('title') ||
                     $el.find('img').attr('alt') ||
                     '';
        const href = $el.attr('href') || '';
        if (img && name) {
          const absImg = img.startsWith('http') ? img : `https://www.gazeteoku.com${img}`;
          const absUrl = href.startsWith('http') ? href : `https://www.gazeteoku.com${href}`;
          items.push({
            name: name.replace(/[\r\n\t]+/g, ' ').trim(),
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
            image: absImg,
            url: absUrl,
          });
        }
      });

      // Deduplicate by name
      const seen = new Set<string>();
      const unique = items.filter((it) => {
        if (seen.has(it.name)) return false;
        seen.add(it.name);
        return true;
      });

      if (unique.length === 0) {
        this.logger.warn(
          '[newspapers] gazeteoku.com scrape returned 0 items — selectors may be outdated',
        );
      }

      return {
        items: unique.slice(0, 40),
        date: new Date().toISOString().split('T')[0],
      };
    } catch (err: any) {
      this.logger.warn(`[newspapers] fetch failed: ${err?.message ?? err}`);
      return { items: [], date: new Date().toISOString().split('T')[0] };
    }
  }
}
