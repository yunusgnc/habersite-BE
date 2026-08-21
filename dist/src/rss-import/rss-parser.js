"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFeed = parseFeed;
const RX_ITEM = /<item\b[^>]*>([\s\S]*?)<\/item>/gi;
const RX_ATOM_ENTRY = /<entry\b[^>]*>([\s\S]*?)<\/entry>/gi;
function decodeEntities(s) {
    return s
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
        .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
        .replace(/&amp;/g, '&');
}
function stripCdata(s) {
    const m = s.match(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/);
    return m ? m[1] : s;
}
function stripTags(s) {
    return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function extractTag(block, tag) {
    const rx = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
    const m = block.match(rx);
    if (!m)
        return null;
    return decodeEntities(stripCdata(m[1])).trim();
}
function extractAttr(block, tag, attr) {
    const rx = new RegExp(`<${tag}\\b[^>]*\\b${attr}=["']([^"']+)["'][^>]*>`, 'i');
    const m = block.match(rx);
    return m ? decodeEntities(m[1]) : null;
}
function parseDate(raw) {
    if (!raw)
        return null;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? null : d;
}
function parseItem(block) {
    const title = extractTag(block, 'title');
    if (!title)
        return null;
    let link = extractTag(block, 'link');
    if (!link) {
        link = extractAttr(block, 'link', 'href');
    }
    const guidRaw = extractTag(block, 'guid') ?? link ?? null;
    if (!guidRaw)
        return null;
    const description = extractTag(block, 'description') ??
        extractTag(block, 'summary') ??
        extractTag(block, 'content:encoded') ??
        extractTag(block, 'content') ??
        '';
    const pubDate = extractTag(block, 'pubDate') ??
        extractTag(block, 'published') ??
        extractTag(block, 'updated');
    let image = extractAttr(block, 'enclosure', 'url') ??
        extractAttr(block, 'media:content', 'url') ??
        extractAttr(block, 'media:thumbnail', 'url');
    if (!image && description) {
        const imgMatch = description.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
        if (imgMatch)
            image = imgMatch[1];
    }
    return {
        guid: guidRaw,
        title: stripTags(title),
        description: description ?? '',
        link: link ?? null,
        publishedAt: parseDate(pubDate),
        imageUrl: image ?? null,
    };
}
function parseFeed(xml) {
    const items = [];
    const rx = xml.includes('<entry') && !xml.includes('<item') ? RX_ATOM_ENTRY : RX_ITEM;
    let m;
    while ((m = rx.exec(xml)) !== null) {
        const item = parseItem(m[1]);
        if (item)
            items.push(item);
    }
    return items;
}
//# sourceMappingURL=rss-parser.js.map