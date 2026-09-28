"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KURUM_BILINMIYOR = void 0;
exports.kurumBul = kurumBul;
exports.ilanTuruBul = ilanTuruBul;
exports.ilanSlugu = ilanSlugu;
exports.habereGoreIlan = habereGoreIlan;
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
exports.KURUM_BILINMIYOR = 'Diğer Kurumlar';
const KURUM_KALIPLARI = [
    {
        desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+B(?:üyükşehir|\.?\s?B\.?)\s*Beled/iu,
        ad: (m) => `${buyukHarfBasla(m[1])} Büyükşehir Belediyesi`,
    },
    { desen: /\bbüyükşehir\b/iu, ad: () => 'Kayseri Büyükşehir Belediyesi' },
    {
        desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+b\.?\s?b\.?(?:\s|$)/iu,
        ad: (m) => `${buyukHarfBasla(m[1])} Büyükşehir Belediyesi`,
    },
    {
        desen: /\b([A-ZÇĞİÖŞÜa-zçğıöşü]+)\s+beled/iu,
        ad: (m) => `${buyukHarfBasla(m[1])} Belediyesi`,
    },
    { desen: /\bticaret\s+odas/iu, ad: () => 'Kayseri Ticaret Odası' },
    { desen: /\bsanayi\s+odas/iu, ad: () => 'Kayseri Sanayi Odası' },
    { desen: /\bticaret\s+borsas/iu, ad: () => 'Kayseri Ticaret Borsası' },
    { desen: /\büniversite/iu, ad: () => 'Üniversite' },
    { desen: /\b(defterdarl|vergi\s+dairesi)/iu, ad: () => 'Defterdarlık' },
    { desen: /\b(icra|mahkeme)/iu, ad: () => 'Adliye' },
    { desen: /\b(kaymakaml|valilik)/iu, ad: () => 'Valilik / Kaymakamlık' },
    { desen: /\bmilli\s+emlak/iu, ad: () => 'Milli Emlak' },
    { desen: /\btedaş|enerji\s+dağıtım/iu, ad: () => 'Enerji Dağıtım' },
];
const TUR_KALIPLARI = [
    { desen: /\bihale/iu, tur: client_1.NoticeType.TENDER },
    { desen: /\b(müzayede|mezat|satış|satis|satılık|arsa|daire|villa|iş\s?yeri|ofis)/iu, tur: client_1.NoticeType.AUCTION },
    { desen: /\b(personel|alım|alim|işçi|memur|sözleşmeli|sinav|sınav)/iu, tur: client_1.NoticeType.RECRUITMENT },
    { desen: /\b(imar|plan\s+değişikliği|parselasyon|kamulaştırma)/iu, tur: client_1.NoticeType.ZONING },
    { desen: /\b(icra|mahkeme|tebligat|tebliğ)/iu, tur: client_1.NoticeType.COURT },
    { desen: /\b(duyuru|ilan|davet|fuar|şenlik|bayram|yardım)/iu, tur: client_1.NoticeType.ANNOUNCEMENT },
];
function katla(metin) {
    return metin.replace(/[İI]/g, 'i').toLowerCase();
}
function buyukHarfBasla(kelime) {
    return kelime.charAt(0).toLocaleUpperCase('tr-TR') + kelime.slice(1).toLocaleLowerCase('tr-TR');
}
function kurumBul(baslik) {
    const katlanmis = katla(baslik);
    for (const kalip of KURUM_KALIPLARI) {
        const eslesme = katlanmis.match(kalip.desen);
        if (eslesme)
            return kalip.ad(eslesme);
    }
    return exports.KURUM_BILINMIYOR;
}
function ilanTuruBul(baslik) {
    const katlanmis = katla(baslik);
    for (const kalip of TUR_KALIPLARI) {
        if (kalip.desen.test(katlanmis))
            return kalip.tur;
    }
    return client_1.NoticeType.OTHER;
}
function ilanSlugu(haber) {
    const mevcut = (haber.slug ?? '').trim();
    const bozuk = !mevcut || /^https?:|[/:?#]/.test(mevcut);
    const kaynak = bozuk ? haber.title : mevcut;
    const uretilen = (0, slugify_1.default)(kaynak, { lower: true, strict: true, locale: 'tr' });
    return uretilen || `ilan-${haber.id.slice(-8)}`;
}
function govdeMetni(content) {
    if (!content)
        return '';
    if (typeof content === 'string')
        return content;
    if (typeof content === 'object' && content !== null) {
        const html = content.html;
        if (typeof html === 'string')
            return html;
    }
    return '';
}
function ozet(haber) {
    const ham = (haber.spot ?? haber.seoDesc ?? '').trim();
    if (!ham)
        return null;
    const temiz = ham.replace(/^resm[iİ]\s+[iİ]lan\s*[:—-]\s*/i, '').trim();
    return temiz && temiz.toLocaleLowerCase('tr-TR') !== haber.title.trim().toLocaleLowerCase('tr-TR')
        ? temiz
        : null;
}
function habereGoreIlan(haber, gecerlilikGun = 30) {
    const yayin = new Date(haber.publishedAt ?? haber.createdAt ?? Date.now());
    const gorsel = (haber.featuredImage ?? '').trim();
    return {
        title: haber.title.trim(),
        slug: ilanSlugu(haber),
        noticeType: ilanTuruBul(haber.title),
        institution: kurumBul(haber.title),
        summary: ozet(haber),
        content: govdeMetni(haber.content),
        attachments: gorsel ? [{ url: gorsel, name: `${haber.title.trim()} (ilan görseli)` }] : [],
        publishedAt: yayin,
        expiresAt: new Date(yayin.getTime() + gecerlilikGun * 86400000),
    };
}
//# sourceMappingURL=haber-ilan-donusturucu.js.map