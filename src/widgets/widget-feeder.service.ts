import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { WidgetsService } from './widgets.service';

type Feeder = (config: any) => Promise<any>;

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
  };

  constructor(
    private readonly prisma: PrismaService,
    private readonly widgets: WidgetsService,
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
  private async fetchNewspapers(_config: any) {
    const url = 'https://www.gazeteoku.com/gazeteler';

    try {
      const { data: html } = await axios.get(url, {
        timeout: 20000,
        headers: SCRAPE_HEADERS,
        responseType: 'text',
      });
      const $ = cheerio.load(html);

      const items: Array<{
        name: string;
        slug: string;
        image: string;
        imageFull: string;
        url: string;
        date: string;
      }> = [];

      $('.newspapers a[href*="-manseti"]').each((_, el) => {
        const $el = $(el);
        const $img = $el.find('img').first();

        // src bir 1x1 placeholder — gerçek adres data-src'de.
        const thumb = $img.attr('data-src') || $img.attr('src') || '';
        if (!thumb || thumb.includes('blank.png')) return;

        const name =
          $el.attr('title')?.trim() ||
          $img.attr('alt')?.trim() ||
          $el.find('strong').first().text().trim();
        if (!name) return;

        const href = $el.attr('href') || '';
        const absUrl = href.startsWith('http') ? href : `https://www.gazeteoku.com${href}`;
        const slug =
          href.split('/').pop()?.replace(/-gazetesi-manseti$/, '') ||
          slugify(name, { lower: true, strict: true, locale: 'tr' });

        items.push({
          name,
          slug,
          image: thumb,
          // Boyut segmentini tamamen at → kırpılmamış orijinal (1280x~2150).
          imageFull: thumb.replace(/^(https?:\/\/[^/]+)\/\d+\/\d+\/\d+\//, '$1/'),
          url: absUrl,
          date: $el.find('small').first().text().trim(),
        });
      });

      const seen = new Set<string>();
      const unique = items.filter((it) => {
        const key = it.slug || it.name;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      if (unique.length === 0) {
        this.logger.warn(
          `[newspapers] ${url} scrape returned 0 items — selectors may be outdated`,
        );
      } else {
        this.logger.log(`[newspapers] ${unique.length} gazete kapağı alındı`);
      }

      return {
        items: unique.slice(0, 40),
        source: url,
        date: new Date().toISOString().split('T')[0],
      };
    } catch (err: any) {
      this.logger.warn(`[newspapers] fetch failed: ${err?.message ?? err}`);
      return { items: [], date: new Date().toISOString().split('T')[0] };
    }
  }

  /**
   * Nöbetçi eczaneler — eczaneler.gen.tr'den şehrin günlük nöbet listesi.
   * Sayfa gün sekmelerine ayrılmış: #nav-bugun / #nav-yarin. "Bugün"
   * sekmesi boşsa (gece yarısından sonra site sekmeleri kaydırır) yarına düşer.
   * Config: { city?: string }  (varsayılan: Kayseri)
   */
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
