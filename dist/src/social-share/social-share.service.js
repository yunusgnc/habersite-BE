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
function agSecimi(shareTargets) {
    if (!Array.isArray(shareTargets))
        return () => true;
    const secilenler = new Set(shareTargets.map((x) => String(x)));
    return (ag) => secilenler.has(ag);
}
const AG_AYARLARI = [
    ['telegram', 'autoShareTelegram'],
    ['facebook', 'autoShareFacebook'],
    ['instagram', 'autoShareInstagram'],
    ['x', 'autoShareTwitter'],
];
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
            const secili = agSecimi(haber.shareTargets);
            if (!AG_AYARLARI.some(([ag, anahtar]) => secili(ag) && ayarlar[anahtar] === 'on')) {
                return;
            }
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
        }
        catch (err) {
            this.logger.warn(`Sosyal paylaşım atlandı (${tenantId}): ${err.message}`);
        }
    }
    async baglantiyiSina(tenantId, ag) {
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
        }
        catch (err) {
            return {
                tamam: false,
                mesaj: `Sınama tamamlanamadı: ${err.message}`,
            };
        }
    }
    async telegramiSina(tenantId, ayarlar) {
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
        const cagir = async (uc, sorgu) => {
            const adres = new URL(`https://api.telegram.org/bot${token}/${uc}`);
            for (const [k, v] of Object.entries(sorgu ?? {})) {
                adres.searchParams.set(k, v);
            }
            const yanit = await fetch(adres, {
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const veri = await yanit.json().catch(() => ({}));
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
    async facebooguSina(tenantId, ayarlar) {
        const sayfa = String(ayarlar.facebookPageId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'facebookPageToken');
        if (!token)
            return { tamam: false, mesaj: 'Sayfa Erişim Anahtarı kayıtlı değil.' };
        if (!sayfa)
            return { tamam: false, mesaj: 'Sayfa Kimliği boş.' };
        const yanit = await fetch(`${graphApiBase()}/${sayfa}?fields=name&access_token=${encodeURIComponent(token)}`, { signal: AbortSignal.timeout(ZAMAN_ASIMI_MS) });
        const veri = await yanit.json().catch(() => ({}));
        return yanit.ok && veri?.name
            ? { tamam: true, mesaj: `Hazır — "${veri.name}" sayfasına bağlanıldı.` }
            : {
                tamam: false,
                mesaj: `Sayfaya erişilemedi (${hataMesaji(veri, yanit.status)}). Sayfa Kimliğini ve anahtarın süresini kontrol edin.`,
            };
    }
    async instagramiSina(tenantId, ayarlar) {
        const hesap = String(ayarlar.instagramUserId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'instagramToken');
        if (!token)
            return { tamam: false, mesaj: 'Erişim Anahtarı kayıtlı değil.' };
        if (!hesap)
            return { tamam: false, mesaj: 'Instagram Hesap Kimliği boş.' };
        const yanit = await fetch(`${graphApiBase()}/${hesap}?fields=username&access_token=${encodeURIComponent(token)}`, { signal: AbortSignal.timeout(ZAMAN_ASIMI_MS) });
        const veri = await yanit.json().catch(() => ({}));
        return yanit.ok && veri?.username
            ? { tamam: true, mesaj: `Hazır — @${veri.username} hesabına bağlanıldı.` }
            : {
                tamam: false,
                mesaj: `Hesaba erişilemedi (${hataMesaji(veri, yanit.status)}). Hesabın İşletme/İçerik Üretici olduğundan ve bir Facebook sayfasına bağlı olduğundan emin olun.`,
            };
    }
    async xiSina(tenantId) {
        const token = await this.twitterToken(tenantId);
        if (!token)
            return { tamam: false, mesaj: 'Erişim Anahtarı kayıtlı değil.' };
        const yanit = await fetch(`${X_API}/2/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
            signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
        });
        const veri = await yanit.json().catch(() => ({}));
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
    async gorselAdresi(siteKoku, haber) {
        const kapak = String(haber.featuredImage ?? '').trim();
        const adaylar = [
            `${siteKoku}/api/social-image/${encodeURIComponent(haber.slug)}`,
            /^https?:\/\//i.test(kapak) ? kapak : '',
        ].filter(Boolean);
        for (const aday of adaylar) {
            if (await this.gorselMi(aday))
                return aday;
        }
        this.logger.warn(`Paylaşılabilir görsel bulunamadı (${haber.slug}); metin gönderisine düşülüyor`);
        return null;
    }
    async gorselMi(adres) {
        const iste = (yontem) => fetch(adres, {
            method: yontem,
            signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
        });
        try {
            let yanit = await iste('HEAD');
            if (yanit.status === 405 || yanit.status === 501) {
                yanit = await iste('GET');
            }
            await yanit.body?.cancel().catch(() => undefined);
            const tur = (yanit.headers.get('content-type') ?? '')
                .split(';')[0]
                .trim()
                .toLowerCase();
            return yanit.ok && tur.startsWith('image/');
        }
        catch {
            return false;
        }
    }
    async telegram(tenantId, ayarlar, baslik, baglanti, gorsel) {
        if (ayarlar.autoShareTelegram !== 'on')
            return;
        const kanal = String(ayarlar.telegramChatId ?? '').trim();
        const token = await this.settings.getSecret(tenantId, 'telegramBotToken');
        if (!kanal || !token)
            return;
        const metin = `${baslik}\n${baglanti}`;
        const cagir = async (uc, govde) => {
            const yanit = await fetch(`https://api.telegram.org/bot${token}/${uc}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: kanal, ...govde }),
                signal: AbortSignal.timeout(ZAMAN_ASIMI_MS),
            });
            const veri = await yanit.json().catch(() => ({}));
            return {
                tamam: yanit.ok && veri.ok !== false,
                hata: hataMesaji(veri, yanit.status),
            };
        };
        try {
            if (gorsel) {
                const foto = await cagir('sendPhoto', {
                    photo: gorsel,
                    caption: metin,
                });
                if (foto.tamam)
                    return;
                this.logger.warn(`Telegram fotoğraflı gönderi reddedildi (${tenantId}), metin olarak deneniyor: ${foto.hata}`);
            }
            const yazi = await cagir('sendMessage', { text: metin });
            if (!yazi.tamam) {
                this.logger.warn(`Telegram paylaşımı reddedildi (${tenantId}): ${yazi.hata}`);
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
                const veri = await yanit.json().catch(() => ({}));
                this.logger.warn(`Facebook paylaşımı reddedildi (${tenantId}): ${hataMesaji(veri, yanit.status)}`);
            }
        };
        try {
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
                const veri = await yanit.json().catch(() => ({}));
                this.logger.warn(`Facebook fotoğraflı gönderi reddedildi (${tenantId}), bağlantı olarak deneniyor: ${hataMesaji(veri, yanit.status)}`);
                await baglantiGonderisi();
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
            this.logger.warn(`Instagram paylaşımı atlandı (${tenantId}): paylaşılabilir görsel yok`);
            return;
        }
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
                if (!gorsel)
                    throw new Error('paylaşılabilir görsel yok');
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