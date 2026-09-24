import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateCartoonDto } from './dto/create-cartoon.dto';
import { UpdateCartoonDto } from './dto/update-cartoon.dto';

export type PublicCartoonQuery = {
  limit?: number;
  cursor?: string;
  /** Sayfa numarası — verilirse cursor yerine offset kullanılır. */
  page?: number;
  artist?: string;
  search?: string;
};

const REVALIDATE_TAGS = ['cartoons'] as const;

/** Listede taşınması gereken alanlar — gövde (caption) listede kırpılmıyor. */
const LISTE_ALANLARI = {
  id: true,
  title: true,
  slug: true,
  image: true,
  imageAlt: true,
  artist: true,
  caption: true,
  publishedAt: true,
  viewCount: true,
} as const;

@Injectable()
export class CartoonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revalidation: RevalidationService,
  ) {}

  // ── Public ──────────────────────────────────────────────────────────

  /**
   * Sitenin karikatür listesi. Yayın tarihi gelecekte olan kayıtlar
   * görünmez — editör karikatürü önceden hazırlayıp tarih verebilsin.
   *
   * İki sayfalama biçimi var: `page` ile offset (adres paylaşılabilir ve
   * arama motoru derin sayfaları tarayabilir), yoksa cursor.
   */
  async findPublic(tenantId: string, query: PublicCartoonQuery = {}) {
    const take = Math.min(Math.max(query.limit ?? 24, 1), 60);
    const where = this.publicWhere(tenantId, query);
    const sayfa = query.page && query.page > 0 ? Math.floor(query.page) : null;

    const [items, total] = await Promise.all([
      this.prisma.cartoon.findMany({
        where,
        take: take + 1,
        ...(sayfa
          ? { skip: (sayfa - 1) * take }
          : query.cursor
            ? { cursor: { id: query.cursor }, skip: 1 }
            : {}),
        // id tiebreaker: publishedAt tekil değil, sayfalamanın deterministik
        // olması için şart — yoksa sayfa sınırında kayıt tekrarlanıp başkası
        // hepten atlanıyor.
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        select: LISTE_ALANLARI,
      }),
      this.prisma.cartoon.count({ where }),
    ]);

    const hasMore = items.length > take;
    const data = hasMore ? items.slice(0, take) : items;

    return {
      data,
      nextCursor: hasMore && !sayfa ? data[data.length - 1].id : null,
      total,
      page: sayfa ?? undefined,
      totalPages: Math.max(1, Math.ceil(total / take)),
      hasMore,
    };
  }

  async findBySlug(tenantId: string, slug: string) {
    const cartoon = await this.prisma.cartoon.findFirst({
      where: { tenantId, slug, active: true, publishedAt: { lte: new Date() } },
    });
    if (!cartoon) throw new NotFoundException('Cartoon not found');

    // Sayaç sayfa render'ını bloklamasın.
    this.prisma.cartoon
      .update({ where: { id: cartoon.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => undefined);

    return cartoon;
  }

  /**
   * Detay sayfasındaki "önceki / sonraki karikatür" gezintisi.
   * Yayın tarihi eşitse id ile ayrışır — liste sıralamasıyla aynı mantık.
   */
  async neighbours(tenantId: string, slug: string) {
    const current = await this.prisma.cartoon.findFirst({
      where: { tenantId, slug },
      select: { id: true, publishedAt: true },
    });
    if (!current) return { previous: null, next: null };

    const taban = { tenantId, active: true, publishedAt: { lte: new Date() } };
    const secim = { title: true, slug: true, image: true } as const;

    const [previous, next] = await Promise.all([
      // Daha ESKİ kayıt.
      this.prisma.cartoon.findFirst({
        where: {
          ...taban,
          OR: [
            { publishedAt: { lt: current.publishedAt } },
            { publishedAt: current.publishedAt, id: { lt: current.id } },
          ],
        },
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        select: secim,
      }),
      // Daha YENİ kayıt.
      this.prisma.cartoon.findFirst({
        where: {
          ...taban,
          OR: [
            { publishedAt: { gt: current.publishedAt } },
            { publishedAt: current.publishedAt, id: { gt: current.id } },
          ],
        },
        orderBy: [{ publishedAt: 'asc' }, { id: 'asc' }],
        select: secim,
      }),
    ]);

    return { previous, next };
  }

  /** Çizer listesi — site tarafındaki filtre açılırı için. */
  async artists(tenantId: string) {
    const rows = await this.prisma.cartoon.groupBy({
      by: ['artist'],
      where: { tenantId, active: true, artist: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
      take: 40,
    });
    return rows
      .filter((r) => r.artist)
      .map((r) => ({ name: r.artist as string, count: r._count._all }));
  }

  /** Sitemap için hafif liste. */
  async sitemap(tenantId: string) {
    return this.prisma.cartoon.findMany({
      where: { tenantId, active: true, publishedAt: { lte: new Date() } },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: 5000,
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
  }

  // ── Admin ───────────────────────────────────────────────────────────

  async findAll(
    tenantId: string,
    opts: { limit?: number; cursor?: string; search?: string } = {},
  ) {
    const take = Math.min(Math.max(opts.limit ?? 30, 1), 100);

    const where: Prisma.CartoonWhereInput = { tenantId };
    if (opts.search?.trim()) {
      const q = opts.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { artist: { contains: q, mode: 'insensitive' } },
        { caption: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.cartoon.findMany({
      where,
      take: take + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = items.length > take;
    return {
      data: hasMore ? items.slice(0, take) : items,
      nextCursor: hasMore ? items[take - 1].id : null,
    };
  }

  async findOne(tenantId: string, id: string) {
    const cartoon = await this.prisma.cartoon.findFirst({ where: { id, tenantId } });
    if (!cartoon) throw new NotFoundException('Cartoon not found');
    return cartoon;
  }

  async stats(tenantId: string) {
    const now = new Date();
    const [total, active, scheduled] = await Promise.all([
      this.prisma.cartoon.count({ where: { tenantId } }),
      this.prisma.cartoon.count({
        where: { tenantId, active: true, publishedAt: { lte: now } },
      }),
      this.prisma.cartoon.count({
        where: { tenantId, active: true, publishedAt: { gt: now } },
      }),
    ]);
    return { total, active, scheduled };
  }

  async create(tenantId: string, dto: CreateCartoonDto) {
    const slug = await this.uniqueSlug(tenantId, dto.slug || dto.title);

    const created = await this.prisma.cartoon.create({
      data: {
        tenantId,
        title: dto.title.trim(),
        slug,
        image: dto.image.trim(),
        imageAlt: dto.imageAlt?.trim() || null,
        artist: dto.artist?.trim() || null,
        caption: dto.caption?.trim() || null,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
        active: dto.active ?? true,
        seoTitle: dto.seoTitle?.trim() || null,
        seoDesc: dto.seoDesc?.trim() || null,
      },
    });

    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return created;
  }

  async update(tenantId: string, id: string, dto: UpdateCartoonDto) {
    const current = await this.findOne(tenantId, id);

    // Slug yalnızca açıkça değiştirildiğinde yenilenir — yayındaki bir
    // karikatürün adresi başlık düzeltmesi yüzünden kırılmasın.
    const slug =
      dto.slug && dto.slug !== current.slug
        ? await this.uniqueSlug(tenantId, dto.slug, id)
        : undefined;

    const updated = await this.prisma.cartoon.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        slug,
        image: dto.image?.trim(),
        imageAlt: dto.imageAlt !== undefined ? dto.imageAlt?.trim() || null : undefined,
        artist: dto.artist !== undefined ? dto.artist?.trim() || null : undefined,
        caption: dto.caption !== undefined ? dto.caption?.trim() || null : undefined,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        active: dto.active,
        seoTitle: dto.seoTitle !== undefined ? dto.seoTitle?.trim() || null : undefined,
        seoDesc: dto.seoDesc !== undefined ? dto.seoDesc?.trim() || null : undefined,
      },
    });

    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return updated;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.cartoon.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return { deleted: true };
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  private publicWhere(
    tenantId: string,
    query: PublicCartoonQuery,
  ): Prisma.CartoonWhereInput {
    const where: Prisma.CartoonWhereInput = {
      tenantId,
      active: true,
      publishedAt: { lte: new Date() },
    };
    if (query.artist?.trim()) {
      where.artist = { equals: query.artist.trim(), mode: 'insensitive' };
    }
    if (query.search?.trim()) {
      const q = query.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { caption: { contains: q, mode: 'insensitive' } },
        { artist: { contains: q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  private async uniqueSlug(tenantId: string, source: string, ignoreId?: string) {
    const base =
      slugify(source, { lower: true, strict: true, locale: 'tr' }) || 'karikatur';

    const clash = await this.prisma.cartoon.findFirst({
      where: { tenantId, slug: base, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    });

    return clash ? `${base}-${Date.now().toString(36)}` : base;
  }
}
