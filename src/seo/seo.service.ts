import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const xmlEscape = (s: string): string =>
  s.replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[c]!));

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  /** Sitemap için tenant'ın public URL'ini ayarlardan alır, yoksa host'a düşer. */
  private async siteUrl(tenantId: string): Promise<string> {
    const s = await this.prisma.setting.findFirst({
      where: { tenantId, key: 'siteUrl' },
    });
    const raw = (s?.value as any)?.toString().trim();
    if (raw) return raw.replace(/\/$/, '');
    return '';
  }

  async buildSitemap(tenantId: string): Promise<string> {
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

    const urls: string[] = [];
    urls.push(this.urlEntry(base + '/', now, '1.0', 'daily'));

    for (const a of articles) {
      const lastmod = (a.updatedAt ?? a.publishedAt ?? new Date()).toISOString();
      urls.push(
        this.urlEntry(`${base}/haber/${a.slug}`, lastmod, '0.8', 'weekly'),
      );
    }
    for (const c of categories) {
      urls.push(
        this.urlEntry(
          `${base}/kategori/${c.slug}`,
          c.updatedAt.toISOString(),
          '0.6',
          'daily',
        ),
      );
    }
    for (const p of pages) {
      urls.push(
        this.urlEntry(
          `${base}/${p.slug}`,
          p.updatedAt.toISOString(),
          '0.5',
          'monthly',
        ),
      );
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
  }

  private urlEntry(
    loc: string,
    lastmod: string,
    priority: string,
    changefreq: string,
  ): string {
    return `  <url><loc>${xmlEscape(loc)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
  }

  async buildRss(tenantId: string): Promise<string> {
    const base = await this.siteUrl(tenantId);
    const setting = await this.prisma.setting.findFirst({
      where: { tenantId, key: 'siteTitle' },
    });
    const siteTitle = (setting?.value as any)?.toString() || 'Haber';

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
}
