import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
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
    const signs: Array<{ name: string; symbol: string; slug: string }> = [
      { name: 'Koç', symbol: '♈', slug: 'aries' },
      { name: 'Boğa', symbol: '♉', slug: 'taurus' },
      { name: 'İkizler', symbol: '♊', slug: 'gemini' },
      { name: 'Yengeç', symbol: '♋', slug: 'cancer' },
      { name: 'Aslan', symbol: '♌', slug: 'leo' },
      { name: 'Başak', symbol: '♍', slug: 'virgo' },
      { name: 'Terazi', symbol: '♎', slug: 'libra' },
      { name: 'Akrep', symbol: '♏', slug: 'scorpio' },
      { name: 'Yay', symbol: '♐', slug: 'sagittarius' },
      { name: 'Oğlak', symbol: '♑', slug: 'capricorn' },
      { name: 'Kova', symbol: '♒', slug: 'aquarius' },
      { name: 'Balık', symbol: '♓', slug: 'pisces' },
    ];
    const results = await Promise.all(
      signs.map(async (s) => {
        try {
          const { data } = await axios.get(
            `https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${s.slug}&day=TODAY`,
            { timeout: 8000 },
          );
          return { ...s, text: data?.data?.horoscope_data ?? '' };
        } catch {
          return { ...s, text: '' };
        }
      }),
    );
    return { signs: results, date: new Date().toISOString().split('T')[0] };
  }
}
