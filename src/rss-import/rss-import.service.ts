import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { parseFeed, FeedItem } from './rss-parser';
import {
  CreateRssSourceDto,
  UpdateRssSourceDto,
} from './dto/rss-source.dto';

/**
 * Ajans/kaynak beslemesi. RSS 2.0 ve Atom feed'lerini periyodik olarak çeker,
 * her item için taslak Article oluşturur. Editör panelden inceleyip yayınlar.
 *
 * Neden DRAFT: otomatik yayın çok riskli — kaynak feed'e bir hata girerse
 * müşterinin sitesine yansır. Manuel onay güvenlik ağı.
 */
@Injectable()
export class RssImportService {
  private readonly logger = new Logger(RssImportService.name);

  constructor(private prisma: PrismaService) {}

  // ─── CRUD ───────────────────────────────────────────────

  async list(tenantId: string) {
    return this.prisma.rssSource.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async get(tenantId: string, id: string) {
    const source = await this.prisma.rssSource.findFirst({
      where: { id, tenantId },
    });
    if (!source) throw new NotFoundException('Kaynak bulunamadı');
    return source;
  }

  async create(tenantId: string, dto: CreateRssSourceDto) {
    return this.prisma.rssSource.create({
      data: {
        tenantId,
        name: dto.name,
        url: dto.url,
        defaultCategoryId: dto.defaultCategoryId,
        defaultAuthorName: dto.defaultAuthorName,
        active: dto.active ?? true,
        fetchIntervalMinutes: dto.fetchIntervalMinutes ?? 30,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateRssSourceDto) {
    await this.get(tenantId, id);
    return this.prisma.rssSource.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.url !== undefined && { url: dto.url }),
        ...(dto.defaultCategoryId !== undefined && {
          defaultCategoryId: dto.defaultCategoryId,
        }),
        ...(dto.defaultAuthorName !== undefined && {
          defaultAuthorName: dto.defaultAuthorName,
        }),
        ...(dto.active !== undefined && { active: dto.active }),
        ...(dto.fetchIntervalMinutes !== undefined && {
          fetchIntervalMinutes: dto.fetchIntervalMinutes,
        }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.get(tenantId, id);
    // Cascade — imported item kayıtları da silinir.
    await this.prisma.rssSource.delete({ where: { id } });
    return { deleted: true };
  }

  // ─── Çekim ──────────────────────────────────────────────

  /**
   * Cron her 5 dakikada bir aktif kaynakları kontrol eder; süresi dolan
   * kaynakları çeker. Kısa aralık + kaynak başına interval → farklı
   * tenant'lar birbirinden bağımsız hızda çekilebilir.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async pollDueSources() {
    const now = new Date();
    const sources = await this.prisma.rssSource.findMany({
      where: { active: true },
      select: {
        id: true,
        tenantId: true,
        fetchIntervalMinutes: true,
        lastFetchedAt: true,
      },
    });
    const due = sources.filter((s) => {
      if (!s.lastFetchedAt) return true;
      const nextDue = new Date(
        s.lastFetchedAt.getTime() + s.fetchIntervalMinutes * 60_000,
      );
      return nextDue <= now;
    });
    if (due.length === 0) return;
    this.logger.log(`[RSS] ${due.length} kaynak çekilecek`);
    for (const s of due) {
      try {
        await this.fetchOne(s.tenantId, s.id);
      } catch (e) {
        this.logger.warn(
          `[RSS] Kaynak ${s.id} çekilemedi: ${(e as Error).message}`,
        );
      }
    }
  }

  async fetchOne(tenantId: string, id: string) {
    const source = await this.get(tenantId, id);
    let xml: string;
    let items: FeedItem[];
    try {
      const res = await fetch(source.url, {
        headers: {
          'User-Agent': 'HaberSite-RSS/1.0 (+https://habersite.com)',
          Accept: 'application/rss+xml, application/atom+xml, application/xml',
        },
        // 15s — ajans feed'leri bazen ağır.
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      xml = await res.text();
      items = parseFeed(xml);
    } catch (e) {
      await this.prisma.rssSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
          lastFetchStatus: `HATA: ${(e as Error).message}`.slice(0, 200),
        },
      });
      throw e;
    }

    if (items.length === 0) {
      await this.prisma.rssSource.update({
        where: { id: source.id },
        data: {
          lastFetchedAt: new Date(),
          lastFetchStatus: 'Feed boş veya parse edilemedi',
        },
      });
      return { imported: 0, skipped: 0 };
    }

    // Import için gereken cihazlar — createdBy zorunlu, tenant'ın ilk ADMIN'i.
    const admin = await this.prisma.user.findFirst({
      where: {
        tenantId,
        role: { in: ['ADMIN', 'SUPER_ADMIN', 'EDITOR'] },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    });
    if (!admin) {
      throw new BadRequestException(
        'Tenant için editör veya admin kullanıcı yok; import edilemiyor',
      );
    }

    // Kategori — kaynağa özel yoksa ilk kategori
    let categoryId = source.defaultCategoryId;
    if (!categoryId) {
      const firstCat = await this.prisma.category.findFirst({
        where: { tenantId, active: true },
        orderBy: { sortOrder: 'asc' },
        select: { id: true },
      });
      categoryId = firstCat?.id ?? null;
    }

    // Yazar — kaynak konfigürasyonundaki ismi bul veya oluştur
    let authorId: string | null = null;
    if (source.defaultAuthorName) {
      const slug = slugify(source.defaultAuthorName, {
        lower: true,
        strict: true,
        locale: 'tr',
      });
      const existing = await this.prisma.author.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
        select: { id: true },
      });
      if (existing) {
        authorId = existing.id;
      } else {
        const created = await this.prisma.author.create({
          data: { tenantId, name: source.defaultAuthorName, slug },
        });
        authorId = created.id;
      }
    }

    let imported = 0;
    let skipped = 0;

    for (const item of items) {
      // Dedup — aynı GUID daha önce alındı mı?
      const already = await this.prisma.rssImportedItem.findUnique({
        where: { sourceId_guid: { sourceId: source.id, guid: item.guid } },
        select: { id: true },
      });
      if (already) {
        skipped++;
        continue;
      }

      // Slug — başlıktan; çakışırsa suffix.
      const baseSlug = slugify(item.title, {
        lower: true,
        strict: true,
        locale: 'tr',
      }).slice(0, 80) || 'haber';
      let slug = baseSlug;
      let n = 1;
      // Küçük döngü — race race değil, tek çekim thread'i.
      while (
        await this.prisma.article.findUnique({
          where: { tenantId_slug: { tenantId, slug } },
          select: { id: true },
        })
      ) {
        slug = `${baseSlug}-${n++}`;
        if (n > 20) {
          slug = `${baseSlug}-${Date.now().toString(36)}`;
          break;
        }
      }

      // İçerik — description'ı basit paragraf olarak sar. Editör panelden düzenler.
      const bodyText = item.description
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .trim();

      try {
        const article = await this.prisma.article.create({
          data: {
            tenantId,
            title: item.title.slice(0, 300),
            slug,
            spot: bodyText ? bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) : null,
            content: {
              type: 'doc',
              content: bodyText
                ? [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }],
                    },
                  ]
                : [{ type: 'paragraph' }],
            } as unknown as any,
            featuredImage: item.imageUrl,
            status: 'DRAFT',
            authorId,
            createdById: admin.id,
            source: source.name,
            sourceUrl: item.link,
            publishedAt: item.publishedAt,
            categories: categoryId
              ? { create: [{ categoryId }] }
              : undefined,
          },
        });

        await this.prisma.rssImportedItem.create({
          data: {
            sourceId: source.id,
            tenantId,
            guid: item.guid,
            articleId: article.id,
          },
        });
        imported++;
      } catch (e) {
        this.logger.warn(
          `[RSS ${source.id}] item hata: ${(e as Error).message}`,
        );
      }
    }

    await this.prisma.rssSource.update({
      where: { id: source.id },
      data: {
        lastFetchedAt: new Date(),
        lastFetchStatus: `OK: ${imported} yeni, ${skipped} atlandı`,
        itemsImported: { increment: imported },
      },
    });

    return { imported, skipped };
  }
}
