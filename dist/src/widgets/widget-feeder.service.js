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
const prisma_service_1 = require("../prisma/prisma.service");
const widgets_service_1 = require("./widgets.service");
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
    };
    constructor(prisma, widgets) {
        this.prisma = prisma;
        this.widgets = widgets;
    }
    async onModuleInit() {
        setTimeout(() => this.refreshAll().catch(() => undefined), 4000);
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
            try {
                const { data } = await axios_1.default.get(`https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily?sign=${s.apiSlug}&day=TODAY`, { timeout: 8000 });
                return {
                    name: s.name,
                    symbol: s.symbol,
                    slug: s.slug,
                    text: data?.data?.horoscope_data ?? '',
                };
            }
            catch {
                return { name: s.name, symbol: s.symbol, slug: s.slug, text: '' };
            }
        }));
        return { signs: results, date: new Date().toISOString().split('T')[0] };
    }
    async fetchNewspapers(_config) {
        try {
            const { data: html } = await axios_1.default.get('https://www.gazeteoku.com/', {
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
                },
            });
            const $ = cheerio.load(html);
            const items = [];
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
            const seen = new Set();
            const unique = items.filter((it) => {
                if (seen.has(it.name))
                    return false;
                seen.add(it.name);
                return true;
            });
            if (unique.length === 0) {
                this.logger.warn('[newspapers] gazeteoku.com scrape returned 0 items — selectors may be outdated');
            }
            return {
                items: unique.slice(0, 40),
                date: new Date().toISOString().split('T')[0],
            };
        }
        catch (err) {
            this.logger.warn(`[newspapers] fetch failed: ${err?.message ?? err}`);
            return { items: [], date: new Date().toISOString().split('T')[0] };
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
exports.WidgetFeederService = WidgetFeederService = WidgetFeederService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        widgets_service_1.WidgetsService])
], WidgetFeederService);
//# sourceMappingURL=widget-feeder.service.js.map