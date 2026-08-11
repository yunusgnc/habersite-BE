"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var WidgetFeederService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WidgetFeederService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const widgets_service_1 = require("./widgets.service");
const SCRAPE_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    'Upgrade-Insecure-Requests': '1',
};
let WidgetFeederService = WidgetFeederService_1 = class WidgetFeederService {
    prisma;
    widgets;
    logger = new common_1.Logger(WidgetFeederService_1.name);
    feeders = {
        weather: this.fetchWeather.bind(this),
        'prayer-times': this.fetchPrayerTimes.bind(this),
        'market-ticker': this.fetchMarketTicker.bind(this),
        horoscope: this.fetchHoroscope.bind(this),
        newspapers: this.fetchNewspapers.bind(this),
        pharmacy: this.fetchPharmacy.bind(this),
    };
    constructor(prisma, widgets) {
        this.prisma = prisma;
        this.widgets = widgets;
    }
    async onModuleInit() {
        setTimeout(async () => {
            try {
                await this.ensureCoreWidgets();
            }
            catch (err) {
                this.logger.warn(`ensureCoreWidgets failed: ${err?.message ?? err}`);
            }
            this.refreshAll().catch(() => undefined);
        }, 4000);
    }
    async ensureCoreWidgets() {
        const defaults = [
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
                if (existing)
                    continue;
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
    async refreshFast() {
        await this.refreshForTypes(['weather', 'market-ticker']);
    }
    async refreshPrayer() {
        await this.refreshForTypes(['prayer-times']);
    }
    async refreshHoroscope() {
        await this.refreshForTypes(['horoscope']);
    }
    async refreshNewspapers() {
        await this.refreshForTypes(['newspapers']);
    }
    async refreshPharmacy() {
        await this.refreshForTypes(['pharmacy']);
    }
    async refreshAll() {
        await this.refreshForTypes(Object.keys(this.feeders));
    }
    async refreshOne(tenantId, type) {
        const feeder = this.feeders[type];
        if (!feeder)
            throw new Error(`No feeder registered for widget type: ${type}`);
        const widget = await this.widgets.findByType(tenantId, type);
        const cache = await feeder(widget?.config ?? {});
        await this.widgets.updateCache(tenantId, type, cache);
        return { ok: true, cachedAt: new Date() };
    }
    async refreshForTypes(types) {
        const widgets = await this.prisma.widget.findMany({
            where: { active: true, type: { in: types } },
        });
        for (const w of widgets) {
            const feeder = this.feeders[w.type];
            if (!feeder)
                continue;
            try {
                const cache = await feeder(w.config ?? {});
                await this.widgets.updateCache(w.tenantId, w.type, cache);
                this.logger.log(`Refreshed widget ${w.type} for tenant ${w.tenantId}`);
            }
            catch (err) {
                this.logger.warn(`Failed to refresh ${w.type} (${w.tenantId}): ${err?.message ?? err}`);
            }
        }
    }
    async fetchWeather(config) {
        const city = config?.city ?? 'Kayseri';
        const { data } = await axios_1.default.get(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=tr`, {
            timeout: 8000,
        });
        const current = data?.current_condition?.[0];
        const forecast = (data?.weather ?? []).slice(0, 5).map((d) => ({
            day: new Date(d.date).toLocaleDateString('tr-TR', { weekday: 'short' }),
            high: d.maxtempC,
            low: d.mintempC,
            condition: d.hourly?.[4]?.lang_tr?.[0]?.value ?? d.hourly?.[4]?.weatherDesc?.[0]?.value ?? '',
        }));
        return {
            city,
            temperature: current?.temp_C ?? '—',
            condition: current?.lang_tr?.[0]?.value ??
                current?.weatherDesc?.[0]?.value ??
                '',
            humidity: current?.humidity,
            wind: current?.windspeedKmph,
            forecast,
        };
    }
    async fetchPrayerTimes(config) {
        const city = config?.city ?? 'Kayseri';
        const country = config?.country ?? 'Turkey';
        const method = config?.method ?? 13;
        const { data } = await axios_1.default.get(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`, { timeout: 8000 });
        const t = data?.data?.timings ?? {};
        const labels = [
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
                .map(([key, label]) => ({ name: label, time: t[key].slice(0, 5) })),
        };
    }
    async fetchMarketTicker(config) {
        const pairs = config?.pairs ?? [
            { from: 'USD', to: 'TRY', label: 'Dolar' },
            { from: 'EUR', to: 'TRY', label: 'Euro' },
            { from: 'GBP', to: 'TRY', label: 'Sterlin' },
        ];
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 3);
        const items = await Promise.all(pairs.map(async (p) => {
            try {
                const [now, prev] = await Promise.all([
                    axios_1.default.get(`https://api.frankfurter.app/latest?from=${p.from}&to=${p.to}`, {
                        timeout: 8000,
                    }),
                    axios_1.default.get(`https://api.frankfurter.app/${yesterday.toISOString().split('T')[0]}?from=${p.from}&to=${p.to}`, { timeout: 8000 }),
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
            }
            catch {
                return { name: p.label, code: `${p.from}/${p.to}`, value: '—', change: '', up: true };
            }
        }));
        return { items };
    }
    async fetchHoroscope(_config) {
        const signs = [
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
        const results = await Promise.all(signs.map(async (s) => {
            let text = '';
            try {
                const { data } = await axios_1.default.get(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${s.apiSlug}&day=TODAY`, { timeout: 8000 });
                text = data?.data?.horoscope_data ?? '';
            }
            catch {
            }
            if (!text || text.trim().length === 0) {
                text = this.pickHoroscopeFallback(s.slug);
            }
            return { name: s.name, symbol: s.symbol, slug: s.slug, text };
        }));
        return { signs: results, date: new Date().toISOString().split('T')[0] };
    }
    pickHoroscopeFallback(slug) {
        const bank = {
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
        if (!arr || arr.length === 0)
            return '';
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
        return arr[dayOfYear % arr.length];
    }
    async fetchNewspapers(_config) {
        const url = 'https://www.gazeteoku.com/gazeteler';
        try {
            const { data: html } = await axios_1.default.get(url, {
                timeout: 20000,
                headers: SCRAPE_HEADERS,
                responseType: 'text',
            });
            const $ = cheerio.load(html);
            const items = [];
            $('.newspapers a[href*="-manseti"]').each((_, el) => {
                const $el = $(el);
                const $img = $el.find('img').first();
                const thumb = $img.attr('data-src') || $img.attr('src') || '';
                if (!thumb || thumb.includes('blank.png'))
                    return;
                const name = $el.attr('title')?.trim() ||
                    $img.attr('alt')?.trim() ||
                    $el.find('strong').first().text().trim();
                if (!name)
                    return;
                const href = $el.attr('href') || '';
                const absUrl = href.startsWith('http') ? href : `https://www.gazeteoku.com${href}`;
                const slug = href.split('/').pop()?.replace(/-gazetesi-manseti$/, '') ||
                    (0, slugify_1.default)(name, { lower: true, strict: true, locale: 'tr' });
                items.push({
                    name,
                    slug,
                    image: thumb,
                    imageFull: thumb.replace(/^(https?:\/\/[^/]+)\/\d+\/\d+\/\d+\//, '$1/'),
                    url: absUrl,
                    date: $el.find('small').first().text().trim(),
                });
            });
            const seen = new Set();
            const unique = items.filter((it) => {
                const key = it.slug || it.name;
                if (seen.has(key))
                    return false;
                seen.add(key);
                return true;
            });
            if (unique.length === 0) {
                this.logger.warn(`[newspapers] ${url} scrape returned 0 items — selectors may be outdated`);
            }
            else {
                this.logger.log(`[newspapers] ${unique.length} gazete kapağı alındı`);
            }
            return {
                items: unique.slice(0, 40),
                source: url,
                date: new Date().toISOString().split('T')[0],
            };
        }
        catch (err) {
            this.logger.warn(`[newspapers] fetch failed: ${err?.message ?? err}`);
            return { items: [], date: new Date().toISOString().split('T')[0] };
        }
    }
    async fetchPharmacy(config) {
        const city = config?.city ?? 'Kayseri';
        const citySlug = (0, slugify_1.default)(city, { lower: true, strict: true, locale: 'tr' });
        const url = `https://www.eczaneler.gen.tr/nobetci-${citySlug}`;
        try {
            const { data: html } = await axios_1.default.get(url, {
                timeout: 15000,
                headers: SCRAPE_HEADERS,
                responseType: 'text',
            });
            const $ = cheerio.load(html);
            const parseTab = (tabId) => {
                const rows = [];
                $(`${tabId} table tr`).each((_, tr) => {
                    const $row = $(tr).find('.row').first();
                    if (!$row.length)
                        return;
                    const name = $row.find('.isim').first().text().trim();
                    if (!name)
                        return;
                    const $addrCol = $row.find('[class*="col-lg-6"]').first();
                    const district = $addrCol.find('.my-2 span').first().text().trim();
                    const address = $addrCol
                        .clone()
                        .find('.my-2')
                        .remove()
                        .end()
                        .text()
                        .replace(/\s*→[\s\S]*$/, '')
                        .replace(/\s+/g, ' ')
                        .trim();
                    const phone = $row.find('[class*="col-lg-3"]').last().text().trim();
                    rows.push({ name, address, district, phone });
                });
                return rows;
            };
            let pharmacies = parseTab('#nav-bugun');
            let scope = 'today';
            if (pharmacies.length === 0) {
                pharmacies = parseTab('#nav-yarin');
                scope = 'tomorrow';
            }
            if (pharmacies.length === 0) {
                this.logger.warn(`[pharmacy] ${url} scrape returned 0 items — selectors may be outdated`);
            }
            return {
                city,
                scope,
                source: url,
                date: new Date().toISOString().split('T')[0],
                pharmacies,
            };
        }
        catch (err) {
            this.logger.warn(`[pharmacy] fetch failed (${url}): ${err?.message ?? err}`);
            return {
                city,
                scope: 'today',
                source: url,
                date: new Date().toISOString().split('T')[0],
                pharmacies: [],
            };
        }
    }
};
exports.WidgetFeederService = WidgetFeederService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WidgetFeederService.prototype, "refreshFast", null);
__decorate([
    (0, schedule_1.Cron)('0 3 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WidgetFeederService.prototype, "refreshPrayer", null);
__decorate([
    (0, schedule_1.Cron)('0 2 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WidgetFeederService.prototype, "refreshHoroscope", null);
__decorate([
    (0, schedule_1.Cron)('0 6 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WidgetFeederService.prototype, "refreshNewspapers", null);
__decorate([
    (0, schedule_1.Cron)('30 8,19 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], WidgetFeederService.prototype, "refreshPharmacy", null);
exports.WidgetFeederService = WidgetFeederService = WidgetFeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        widgets_service_1.WidgetsService])
], WidgetFeederService);
//# sourceMappingURL=widget-feeder.service.js.map