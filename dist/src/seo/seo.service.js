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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const xmlEscape = (s) => s.replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
}[c]));
let SeoService = class SeoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async siteUrl(tenantId) {
        const s = await this.prisma.setting.findFirst({
            where: { tenantId, key: 'siteUrl' },
        });
        const raw = s?.value?.toString().trim();
        if (raw)
            return raw.replace(/\/$/, '');
        return '';
    }
    async buildSitemap(tenantId) {
        const base = await this.siteUrl(tenantId);
        const now = new Date().toISOString();
        const [articles, categories, pages] = await Promise.all([
            this.prisma.article.findMany({
                where: { tenantId, status: 'PUBLISHED' },
                select: { slug: true, updatedAt: true, publishedAt: true },
                orderBy: { publishedAt: 'desc' },
                take: 10_000,
            }),
            this.prisma.category.findMany({
                where: { tenantId },
                select: { slug: true, updatedAt: true },
            }),
            this.prisma.page.findMany({
                where: { tenantId, published: true },
                select: { slug: true, updatedAt: true },
            }),
        ]);
        const urls = [];
        urls.push(this.urlEntry(base + '/', now, '1.0', 'daily'));
        for (const a of articles) {
            const lastmod = (a.updatedAt ?? a.publishedAt ?? new Date()).toISOString();
            urls.push(this.urlEntry(`${base}/haber/${a.slug}`, lastmod, '0.8', 'weekly'));
        }
        for (const c of categories) {
            urls.push(this.urlEntry(`${base}/kategori/${c.slug}`, c.updatedAt.toISOString(), '0.6', 'daily'));
        }
        for (const p of pages) {
            urls.push(this.urlEntry(`${base}/${p.slug}`, p.updatedAt.toISOString(), '0.5', 'monthly'));
        }
        return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
    }
    urlEntry(loc, lastmod, priority, changefreq) {
        return `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    }
    async buildRss(tenantId) {
        const base = await this.siteUrl(tenantId);
        const setting = await this.prisma.setting.findFirst({
            where: { tenantId, key: 'siteTitle' },
        });
        const siteTitle = setting?.value?.toString() || 'Haber';
        const articles = await this.prisma.article.findMany({
            where: { tenantId, status: 'PUBLISHED' },
            orderBy: { publishedAt: 'desc' },
            take: 50,
            include: {
                author: { select: { name: true } },
                categories: { include: { category: true } },
            },
        });
        const items = articles.map((a) => {
            const pubDate = (a.publishedAt ?? a.createdAt).toUTCString();
            const link = `${base}/haber/${a.slug}`;
            const cat = a.categories[0]?.category?.name ?? '';
            return `    <item>
      <title>${xmlEscape(a.title)}</title>
      <link>${xmlEscape(link)}</link>
      <guid isPermaLink="true">${xmlEscape(link)}</guid>
      <pubDate>${pubDate}</pubDate>
      ${a.author?.name ? `<author>${xmlEscape(a.author.name)}</author>` : ''}
      ${cat ? `<category>${xmlEscape(cat)}</category>` : ''}
      <description>${xmlEscape(a.spot ?? '')}</description>
    </item>`;
        });
        return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(siteTitle)}</title>
    <link>${xmlEscape(base)}</link>
    <description>${xmlEscape(siteTitle + ' — son haberler')}</description>
    <language>tr-TR</language>
    <atom:link href="${xmlEscape(base + '/api/seo/rss.xml')}" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map