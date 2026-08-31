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
const X_API = 'https://api.x.com';
function graphApiBase() {
    const surum = (process.env.META_GRAPH_VERSION ?? 'v25.0').trim();
    return `https://graph.facebook.com/${/^v\d+\.\d+$/.test(surum) ? surum : 'v25.0'}`;
}
function hataMesaji(veri, durum) {
    return String(veri?.error?.message ??
        veri?.detail ??
        veri?.title ??
        veri?.description ??
        durum);
}
function xMetni(baslik, baglanti) {
    const temiz = baslik.replace(/\s+/g, ' ').trim();
    const kisaltilmis = temiz.length > 250 ? `${temiz.slice(0, 247).trimEnd()}…` : temiz;
    return `${kisaltilmis}\n${baglanti}`;
}
let SocialShareService = SocialShareService_1 = class SocialShareService {
    settings;
    logger = new common_1.Logger(SocialShareService_1.name);
    constructor(settings) {
        this.settings = settings;
    }
    async paylas(tenantId, haber) {
        try {
            const ayarlar = await this.settings.getAll(tenantId);
            const siteKoku = String(ayarlar.siteUrl ?? '')
                .trim()
                .replace(/\/+$/, '');
            if (!siteKoku)
                return;
            const yol = haber.type === 'COLUMN'
                ? `/makale/${haber.slug}`
                : `/haber/${haber.slug}`;
            const baglanti = `${siteKoku}${yol}`;
            const gorsel = `${siteKoku}/api/social-image/${encodeURIComponent(haber.slug)}`;
            await Promise.allSettled([
                this.telegram(tenantId, ayarlar, haber.title, baglanti, gorsel),
                this.facebook(tenantId, ayarlar, haber.title, baglanti, gorsel),
                this.instagram(tenantId, ayarlar, haber.title, baglanti, gorsel),
                this.twitter(tenantId, ayarlar, haber.title, baglanti, gorsel),
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
            const yanit = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: kanal,
                    photo: gorsel,
                    caption: `${baslik}\n${baglanti}`,
                }),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const veri = await yanit.json().catch(() => ({}));
            if (!yanit.ok || veri.ok === false) {
                this.logger.warn(`Telegram paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`);
            }
        }
        catch (err) {
            this.logger.warn(`Telegram paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
    async facebook(tenantId, ayarlar, baslik, baglanti, gorsel) {
        if (ayarlar.autoShareFacebook !== 'on')
            return;
        const sayfa = String(ayarlar.facebookPageId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
        if (!sayfa || !token)
            return;
        try {
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
                const veri = await yanit.json().catch(() => ({}));
                this.logger.warn(`Facebook paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`);
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
        try {
            const kap = await fetch(`${graphApiBase()}/${hesap}/media`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    image_url: gorsel,
                    caption: `${baslik}\n${baglanti}`,
                    access_token: token,
                }),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const kapVerisi = await kap.json().catch(() => ({}));
            if (!kap.ok || !kapVerisi.id) {
                this.logger.warn(`Instagram medya kabı reddedildi (${tenantId}): ${hataMesaji(kapVerisi, kap.status)}`);
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
                const veri = await yayin.json().catch(() => ({}));
                this.logger.warn(`Instagram yayınlama reddedildi (${tenantId}): ${hataMesaji(veri, yayin.status)}`);
            }
        }
        catch (err) {
            this.logger.warn(`Instagram paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
    async twitter(tenantId, ayarlar, baslik, baglanti, gorsel) {
        if (ayarlar.autoShareTwitter !== 'on')
            return;
        const token = await this.twitterToken(tenantId);
        if (!token)
            return;
        try {
            let medyaId = null;
            try {
                const resimYaniti = await fetch(gorsel, {
                    signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
                });
                const tur = resimYaniti.headers.get('content-type')?.split(';')[0] ?? '';
                const resim = Buffer.from(await resimYaniti.arrayBuffer());
                if (!resimYaniti.ok ||
                    !tur.startsWith('image/') ||
                    resim.length > 5 * 1024 * 1024) {
                    throw new Error(`sosyal görsel uygun değil (HTTP ${resimYaniti.status}, ${tur || 'tür yok'}, ${resim.length} byte)`);
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
                const yuklemeVerisi = await yukleme.json().catch(() => ({}));
                if (!yukleme.ok || !yuklemeVerisi?.data?.id) {
                    throw new Error(hataMesaji(yuklemeVerisi, yukleme.status));
                }
                medyaId = String(yuklemeVerisi.data.id);
            }
            catch (err) {
                this.logger.warn(`X görsel yükleme atlandı (${tenantId}), bağlantı metin olarak paylaşılacak: ${err.message}`);
            }
            const govde = { text: xMetni(baslik, baglanti) };
            if (medyaId)
                govde.media = { media_ids: [medyaId] };
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
                const veri = await yanit.json().catch(() => ({}));
                this.logger.warn(`X paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`);
            }
        }
        catch (err) {
            this.logger.warn(`X paylaşım hatası (${tenantId}): ${err.message}`);
        }
    }
    async twitterToken(tenantId) {
        const [mevcut, yenileme, istemci, istemciSirri] = await Promise.all([
            this.settings.getSecret(tenantId, 'twitterAccessToken'),
            this.settings.getSecret(tenantId, 'twitterRefreshToken'),
            this.settings.getSecret(tenantId, 'twitterClientId'),
            this.settings.getSecret(tenantId, 'twitterClientSecret'),
        ]);
        if (!yenileme || !istemci || !istemciSirri)
            return mevcut;
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
            const veri = await yanit.json().catch(() => ({}));
            if (!yanit.ok || !veri.access_token) {
                this.logger.warn(`X erişim anahtarı yenilenemedi (${tenantId}): ${hataMesaji(veri, yanit.status)}`);
                return mevcut;
            }
            const yeniErisim = String(veri.access_token);
            await Promise.all([
                this.settings.upsert(tenantId, 'twitterAccessToken', yeniErisim),
                veri.refresh_token
                    ? this.settings.upsert(tenantId, 'twitterRefreshToken', String(veri.refresh_token))
                    : Promise.resolve(),
            ]);
            return yeniErisim;
        }
        catch (err) {
            this.logger.warn(`X erişim anahtarı yenileme hatası (${tenantId}): ${err.message}`);
            return mevcut;
        }
    }
};
exports.SocialShareService = SocialShareService;
exports.SocialShareService = SocialShareService = SocialShareService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SocialShareService);
//# sourceMappingURL=social-share.service.js.map