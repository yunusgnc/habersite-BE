"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SocialShareService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialShareService = void 0;
const common_1 = require("@nestjs/common");
const settings_service_1 = require("../settings/settings.service");
const ZAMAN_ASIMI_MS = 10_000;
const GRAPH = 'https://graph.facebook.com/v19.0';
let SocialShareService = SocialShareService_1 = class SocialShareService {
    settings;
    logger = new common_1.Logger(SocialShareService_1.name);
    constructor(settings) {
        this.settings = settings;
    }
    async paylas(tenantId, haber) {
        try {
            const ayarlar = await this.settings.getAll(tenantId);
            const siteKoku = String(ayarlar.siteUrl ?? '').trim().replace(/\/+$/, '');
            if (!siteKoku)
                return;
            const yol = haber.type === 'COLUMN' ? `/makale/${haber.slug}` : `/haber/${haber.slug}`;
            const baglanti = `${siteKoku}${yol}`;
            const gorsel = typeof haber.featuredImage === 'string' && /^https?:\/\//.test(haber.featuredImage)
                ? haber.featuredImage
                : null;
            await Promise.allSettled([
                this.telegram(tenantId, ayarlar, haber.title, baglanti, gorsel),
                this.facebook(tenantId, ayarlar, haber.title, baglanti),
                this.instagram(tenantId, ayarlar, haber.title, baglanti, gorsel),
            ]);
        }
        catch (err) {
            this.logger.warn(`Sosyal paylaşım atlandı (${tenantId}): ${err.message}`);
        }
    }
    async telegram(tenantId, ayarlar, baslik, baglanti, gorsel) {
        if (ayarlar.autoShareTelegram !== 'on')
            return;
        const kanal = String(ayarlar.telegramChatId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'telegramBotToken');
        if (!kanal || !token)
            return;
        try {
            const [uc, gövde] = gorsel
                ? ['sendPhoto', { chat_id: kanal, photo: gorsel, caption: `${baslik}\n${baglanti}` }]
                : ['sendMessage', { chat_id: kanal, text: `${baslik}\n${baglanti}` }];
            const yanit = await fetch(`https://api.telegram.org/bot${token}/${uc}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(gövde),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const veri = await yanit.json().catch(() => ({}));
            if (!yanit.ok || veri.ok === false) {
                this.logger.warn(`Telegram paylaşımı reddedildi (${tenantId}): ${veri.description ?? yanit.status}`);
            }
        }
        catch (err) {
            this.logger.warn(`Telegram paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
    async facebook(tenantId, ayarlar, baslik, baglanti) {
        if (ayarlar.autoShareFacebook !== 'on')
            return;
        const sayfa = String(ayarlar.facebookPageId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
        if (!sayfa || !token)
            return;
        try {
            const yanit = await fetch(`${GRAPH}/${sayfa}/feed`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: baslik, link: baglanti, access_token: token }),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            if (!yanit.ok) {
                const veri = await yanit.json().catch(() => ({}));
                this.logger.warn(`Facebook paylaşımı reddedildi (${tenantId}): ${veri?.error?.message ?? yanit.status}`);
            }
        }
        catch (err) {
            this.logger.warn(`Facebook paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
    async instagram(tenantId, ayarlar, baslik, baglanti, gorsel) {
        if (ayarlar.autoShareInstagram !== 'on')
            return;
        const hesap = String(ayarlar.instagramUserId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'instagramToken');
        if (!hesap || !token)
            return;
        if (!gorsel) {
            this.logger.warn(`Instagram paylaşımı atlandı (${tenantId}): haberin mutlak adresli görseli yok`);
            return;
        }
        try {
            const kap = await fetch(`${GRAPH}/${hesap}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: gorsel,
                    caption: `${baslik}\n${baglanti}`,
                    access_token: token,
                }),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const kapVerisi = await kap.json().catch(() => ({}));
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
                const veri = await yayin.json().catch(() => ({}));
                this.logger.warn(`Instagram yayınlama reddedildi (${tenantId}): ${veri?.error?.message ?? yayin.status}`);
            }
        }
        catch (err) {
            this.logger.warn(`Instagram paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
};
exports.SocialShareService = SocialShareService;
exports.SocialShareService = SocialShareService = SocialShareService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SocialShareService);
//# sourceMappingURL=social-share.service.js.map