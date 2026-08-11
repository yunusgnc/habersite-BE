import { Injectable, NotFoundException } from '@nestjs/common';
import { NoticeType, Prisma } from '@prisma/client';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';

export type PublicNoticeQuery = {
  limit?: number;
  cursor?: string;
  noticeType?: NoticeType;
  institution?: string;
  search?: string;
  /** true → süresi geçmiş ilanlar (arşiv), false/undefined → yürürlükte olanlar. */
  archived?: boolean;
};

const REVALIDATE_TAGS = ['official-notices'] as const;

@Injectable()
export class OfficialNoticesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly revalidation: RevalidationService,
  ) {}

  // ── Public ──────────────────────────────────────────────────────────

  async findPublic(tenantId: string, query: PublicNoticeQuery = {}) {
    const take = Math.min(query.limit ?? 20, 60);
    const now = new Date();

    const where: Prisma.OfficialNoticeWhereInput = {
      tenantId,
      active: true,
      publishedAt: { lte: now },
      ...(query.archived
        ? { expiresAt: { not: null, lt: now } }
        : { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] }),
    };

    if (query.noticeType) where.noticeType = query.noticeType;
    if (query.institution?.trim()) {
      where.institution = { contains: query.institution.trim(), mode: 'insensitive' };
    }
    if (query.search?.trim()) {
      const q = query.search.trim();
      // `OR` yukarıda expiresAt için kullanılmış olabilir; AND altında birleştir.
      where.AND = [
        {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { summary: { contains: q, mode: 'insensitive' } },
            { institution: { contains: q, mode: 'insensitive' } },
            { referenceNo: { contains: q, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const items = await this.prisma.officialNotice.findMany({
      where,
      take: take + 1,
      ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        noticeType: true,
        institution: true,
        referenceNo: true,
        summary: true,
        attachments: true,
        publishedAt: true,
        expiresAt: true,
        viewCount: true,
      },
    });

    const hasMore = items.length > take;
    return {
      data: hasMore ? items.slice(0, take) : items,
      nextCursor: hasMore ? items[take - 1].id : null,
    };
  }

  async findBySlug(tenantId: string, slug: string) {
    const notice = await this.prisma.officialNotice.findFirst({
      where: { tenantId, slug, active: true, publishedAt: { lte: new Date() } },
    });
    if (!notice) throw new NotFoundException('Official notice not found');

    // Görüntüleme sayacı sayfa render'ını bloklamasın.
    this.prisma.officialNotice
      .update({ where: { id: notice.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => undefined);

    return notice;
  }

  /** Kurum listesi — site tarafındaki filtre açılırı için. */
  async institutions(tenantId: string) {
    const rows = await this.prisma.officialNotice.groupBy({
      by: ['institution'],
      where: { tenantId, active: true },
      _count: { _all: true },
      orderBy: { _count: { id: 'desc' } },
      take: 40,
    });
    return rows.map((r) => ({ name: r.institution, count: r._count._all }));
  }

  // ── Admin ───────────────────────────────────────────────────────────

  async findAll(
    tenantId: string,
    opts: { limit?: number; cursor?: string; noticeType?: NoticeType; search?: string } = {},
  ) {
    const take = Math.min(opts.limit ?? 30, 100);

    const where: Prisma.OfficialNoticeWhereInput = { tenantId };
    if (opts.noticeType) where.noticeType = opts.noticeType;
    if (opts.search?.trim()) {
      const q = opts.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { institution: { contains: q, mode: 'insensitive' } },
        { referenceNo: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.officialNotice.findMany({
      where,
      take: take + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
      orderBy: { publishedAt: 'desc' },
    });

    const hasMore = items.length > take;
    return {
      data: hasMore ? items.slice(0, take) : items,
      nextCursor: hasMore ? items[take - 1].id : null,
    };
  }

  async findOne(tenantId: string, id: string) {
    const notice = await this.prisma.officialNotice.findFirst({ where: { id, tenantId } });
    if (!notice) throw new NotFoundException('Official notice not found');
    return notice;
  }

  async stats(tenantId: string) {
    const now = new Date();
    const [total, active, expired] = await Promise.all([
      this.prisma.officialNotice.count({ where: { tenantId } }),
      this.prisma.officialNotice.count({
        where: {
          tenantId,
          active: true,
          OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
        },
      }),
      this.prisma.officialNotice.count({
        where: { tenantId, expiresAt: { not: null, lt: now } },
      }),
    ]);
    return { total, active, expired };
  }

  async create(tenantId: string, dto: CreateOfficialNoticeDto) {
    const slug = await this.uniqueSlug(tenantId, dto.slug || dto.title);

    const created = await this.prisma.officialNotice.create({
      data: {
        tenantId,
        title: dto.title.trim(),
        slug,
        noticeType: dto.noticeType ?? NoticeType.TENDER,
        institution: dto.institution.trim(),
        referenceNo: dto.referenceNo?.trim() || null,
        summary: dto.summary?.trim() || null,
        content: dto.content,
        attachments: (dto.attachments ?? []) as unknown as Prisma.InputJsonValue,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        active: dto.active ?? true,
      },
    });

    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return created;
  }

  async update(tenantId: string, id: string, dto: UpdateOfficialNoticeDto) {
    const current = await this.findOne(tenantId, id);

    // Slug yalnızca açıkça değiştirildiğinde yenilenir — yayınlanmış bir
    // ilanın adresi başlık düzeltmesi yüzünden kırılmasın.
    const slug =
      dto.slug && dto.slug !== current.slug
        ? await this.uniqueSlug(tenantId, dto.slug, id)
        : undefined;

    const updated = await this.prisma.officialNotice.update({
      where: { id },
      data: {
        title: dto.title?.trim(),
        slug,
        noticeType: dto.noticeType,
        institution: dto.institution?.trim(),
        referenceNo:
          dto.referenceNo !== undefined ? dto.referenceNo?.trim() || null : undefined,
        summary: dto.summary !== undefined ? dto.summary?.trim() || null : undefined,
        content: dto.content,
        attachments:
          dto.attachments !== undefined
            ? (dto.attachments as unknown as Prisma.InputJsonValue)
            : undefined,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        expiresAt:
          dto.expiresAt !== undefined
            ? dto.expiresAt
              ? new Date(dto.expiresAt)
              : null
            : undefined,
        active: dto.active,
      },
    });

    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return updated;
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);
    await this.prisma.officialNotice.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
    return { deleted: true };
  }

  // ── Helpers ─────────────────────────────────────────────────────────

  private async uniqueSlug(tenantId: string, source: string, ignoreId?: string) {
    const base =
      slugify(source, { lower: true, strict: true, locale: 'tr' }) || 'resmi-ilan';

    const clash = await this.prisma.officialNotice.findFirst({
      where: { tenantId, slug: base, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
      select: { id: true },
    });

    return clash ? `${base}-${Date.now().toString(36)}` : base;
  }
}
