"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duzMetneCevir = duzMetneCevir;
const ADLI_VARLIKLAR = {
    amp: '&',
    lt: '<',
    gt: '>',
    quot: '"',
    apos: "'",
    nbsp: ' ',
    shy: '',
    rsquo: '’',
    lsquo: '‘',
    ldquo: '“',
    rdquo: '”',
    ndash: '–',
    mdash: '—',
    hellip: '…',
    bull: '•',
    middot: '·',
    laquo: '«',
    raquo: '»',
    deg: '°',
    copy: '©',
    reg: '®',
    trade: '™',
    Ccedil: 'Ç',
    ccedil: 'ç',
    Ouml: 'Ö',
    ouml: 'ö',
    Uuml: 'Ü',
    uuml: 'ü',
    Scedil: 'Ş',
    scedil: 'ş',
    Gbreve: 'Ğ',
    gbreve: 'ğ',
    Idot: 'İ',
    inodot: 'ı',
    Acirc: 'Â',
    acirc: 'â',
    Icirc: 'Î',
    icirc: 'î',
    Ucirc: 'Û',
    ucirc: 'û',
};
function varliklariBirKezCoz(metin) {
    return metin.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (tum, govde) => {
        if (govde[0] !== '#')
            return ADLI_VARLIKLAR[govde] ?? tum;
        const sayi = govde[1] === 'x' || govde[1] === 'X'
            ? parseInt(govde.slice(2), 16)
            : parseInt(govde.slice(1), 10);
        return Number.isFinite(sayi) && sayi > 0 && sayi <= 0x10ffff
            ? String.fromCodePoint(sayi)
            : tum;
    });
}
function duzMetneCevir(deger) {
    if (typeof deger !== 'string' || !deger)
        return deger;
    const bir = deger.includes('&') ? varliklariBirKezCoz(deger) : deger;
    const cozulmus = bir.includes('&') ? varliklariBirKezCoz(bir) : bir;
    const temiz = cozulmus
        .replace(/<(script|style|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<br\s*\/?>|<\/(p|div|li|h[1-6])\s*>/gi, ' ')
        .replace(/<\/?[a-z][^>]*>/gi, ' ')
        .replace(/[\s\u00a0]+/g, ' ')
        .trim();
    return temiz;
}
//# sourceMappingURL=plain-text.js.map