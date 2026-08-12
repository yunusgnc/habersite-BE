import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleStatus, Prisma } from '@prisma/client';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { AuditService } from '../common/audit/audit.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';

// Yayınlama yetkisi olan roller — REPORTER/COLUMNIST DRAFT'a kilitlenir.
function canPublishArticle(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role);
}

// Başkasının haberini düzenleme yetkisi olan roller.
function canEditAnyArticle(role: string): boolean {
  return ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role);
}

/**
 * Arşiv tarih aralığını Prisma filtresine çevirir. `to` gün sonuna
 * yuvarlanır — kullanıcı "10 Mart"ı seçtiğinde o günün tamamı dahil olur.
 * Geçersiz tarihler sessizce yok sayılır (DTO zaten ISO doğruluyor).
 */
function buildDateRange(
  from?: string,
  to?: string,
): Prisma.DateTimeFilter | undefined {
  const filter: Prisma.DateTimeFilter = {};

  if (from) {
    const d = new Date(from);
    if (!Number.isNaN(d.getTime())) filter.gte = d;
  }

  if (to) {
    const d = new Date(to);
    if (!Number.isNaN(d.getTime())) {
      // Saat bileşeni verilmemişse (00:00) günün sonuna taşı.
      if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0) {
        d.setUTCHours(23, 59, 59, 999);
      }
      filter.lte = d;
    }
  }

  return Object.keys(filter).length ? filter : undefined;
}

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly revalidation: RevalidationService,
  ) {}

  /**
   * Dakikada bir çalışır: scheduledAt zamanı geçmiş fakat hâlâ DRAFT olan
   * makaleleri otomatik PUBLISHED'a çevirir. publishedAt = scheduledAt.
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async publishScheduled(): Promise<void> {
    const now = new Date();
    const due = await this.prisma.article.findMany({
      where: {
        status: ArticleStatus.DRAFT,
        scheduledAt: { lte: now, not: null },
      },
      select: { id: true, tenantId: true, scheduledAt: true, title: true },
      take: 100,
    });

    if (due.length === 0) return;

    await Promise.all(
      due.map(async (a) => {
        try {
          await this.prisma.article.update({
            where: { id: a.id },
            data: {
              status: ArticleStatus.PUBLISHED,
              publishedAt: a.scheduledAt ?? now,
            },
          });
          void this.audit.log({
            tenantId: a.tenantId,
            action: 'PUBLISH',
            entity: 'article',
            entityId: a.id,
            changes: { title: a.title, source: 'scheduled' },
          });
        } catch (err) {
          this.logger.warn(
            `Zamanlanmış yayın başarısız (${a.id}): ${(err as Error).message}`,
          );
        }
      }),
    );

    this.logger.log(`${due.length} zamanlanmış haber yayınlandı.`);
  }

  async findAll(tenantId: string, query: QueryArticlesDto) {
    const {
      cursor,
      limit = 20,
      status,
      type,
      categorySlug,
      categoryId,
      authorSlug,
      page,
      search,
      searchScope,
      from,
      to,
      tagSlug,
      featured,
      createdById,
      sort = 'latest',
    } = query;

    const where: Prisma.ArticleWhereInput = { tenantId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (featured) where.featured = featured === 'true';
    if (createdById) where.createdById = createdById;

    if (search?.trim()) {
      const q = search.trim();
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
        // 'all' kapsamı başlık dışına da bakar; panelde varsayılan başlık
        // aramasıdır çünkü editör aradığı haberin başlığını bilir.
        searchScope === 'all'
          ? {
              OR: [
                { title: { contains: q, mode: 'insensitive' } },
                { spot: { contains: q, mode: 'insensitive' } },
                { seoDesc: { contains: q, mode: 'insensitive' } },
                { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } },
                { categories: { some: { category: { name: { contains: q, mode: 'insensitive' } } } } },
                { author: { name: { contains: q, mode: 'insensitive' } } },
              ],
            }
          : { title: { contains: q, mode: 'insensitive' } },
      ];
    }

    // Arşiv: yayın tarihi aralığı. `to` gün sonuna yuvarlanır ki
    // "10 Mart"ı seçen kullanıcı o günün haberlerini de görsün.
    const publishedRange = buildDateRange(from, to);
    if (publishedRange) where.publishedAt = publishedRange;

    if (categoryId) {
      where.categories = { some: { categoryId } };
    } else if (categorySlug) {
      where.categories = {
        some: { category: { slug: categorySlug } },
      };
    }

    if (tagSlug) {
      where.tags = { some: { tag: { slug: tagSlug } } };
    }

    if (authorSlug) {
      where.author = { slug: authorSlug };
    }

    // Her siralamanin sonunda `id` tiebreaker'i var: sirasi tek basina belirsiz
    // olan bir alanla (ayni saniyede yayinlanmis haberler, `viewCount: 0` olan
    // binlerce arsiv haberi) sayfalamak satirlarin sayfa sinirinda tekrarlanip
    // baskalarinin tamamen atlanmasina yol aciyor — hem cursor hem offset icin.
    let orderBy: Prisma.ArticleOrderByWithRelationInput[];
    switch (sort) {
      case 'oldest':
        orderBy = [{ publishedAt: 'asc' }, { id: 'asc' }];
        break;
      case 'popular':
        orderBy = [{ viewCount: 'desc' }, { id: 'desc' }];
        break;
      default:
        orderBy = [{ publishedAt: 'desc' }, { id: 'desc' }];
    }

    // İki sayfalama biçimi: `page` verilirse offset (paylaşılabilir, arama
    // motorlarının tarayabileceği adresler), aksi halde cursor (sonsuz
    // kaydırma ve panel listeleri için daha verimli).
    const usePageOffset = Boolean(page && page > 0);

    const [items, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        orderBy,
        take: limit + 1,
        ...(usePageOffset
          ? { skip: (page! - 1) * limit }
          : cursor
            ? { cursor: { id: cursor }, skip: 1 }
            : {}),
        include: {
          categories: { include: { category: true } },
          tags: { include: { tag: true } },
          author: true,
          createdBy: { select: { id: true, name: true, email: true } },
          approvedBy: { select: { id: true, name: true } },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    // limit+1 çekiliyor; fazlası varsa sonraki sayfa var demektir.
    const hasMore = items.length > limit;
    let nextCursor: string | undefined;
    if (hasMore) {
      const next = items.pop();
      if (!usePageOffset) nextCursor = next!.id;
    }

    return {
      items,
      nextCursor,
      total,
      page: usePageOffset ? page : undefined,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore,
    };
  }

  /**
   * Arşiv sayfasının takvim gezintisi için yıl/ay bazlı yayın sayıları.
   * Prisma groupBy tarih kırpma (date_trunc) desteklemediği için raw SQL.
   */
  /**
   * Google News sitemap'i ve RSS feed için son 48 saatteki haberler.
   *
   * Google News en fazla 1000 kayıt kabul ediyor ve yalnızca 2 gün önceye
   * kadar bakıyor — daha eski haberi görürse geçersiz sayıp `sitemap-news`
   * dosyasını hepten kabul etmiyor. Bu yüzden aralığı sabit 48 saat.
   */
  async recentForNews(tenantId: string, limit = 1000) {
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    return this.prisma.article.findMany({
      where: {
        tenantId,
        status: ArticleStatus.PUBLISHED,
        publishedAt: { gte: twoDaysAgo, not: null },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: Math.min(1000, Math.max(1, limit)),
      select: {
        slug: true,
        title: true,
        type: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Sitemap üretimi için hafif liste. Deterministik sıra ((publishedAt, id))
   * paginasyon sırasında satır kaymamasını garanti eder — 42 binin üzerinde
   * kayıt gezileceği için bu şart. Yalnızca slug + tarih döner.
   */
  async sitemap(tenantId: string, page: number, perPage: number) {
    const where = {
      tenantId,
      status: ArticleStatus.PUBLISHED,
    } as const;
    const [total, items] = await Promise.all([
      this.prisma.article.count({ where }),
      this.prisma.article.findMany({
        where,
        orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * perPage,
        take: perPage,
        select: {
          slug: true,
          type: true,
          publishedAt: true,
          updatedAt: true,
        },
      }),
    ]);
    return {
      items,
      page,
      perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / perPage)),
    };
  }

  async archiveFacets(tenantId: string) {
    const rows = await this.prisma.$queryRaw<
      Array<{ year: number; month: number; count: bigint }>
    >`
      SELECT
        EXTRACT(YEAR  FROM published_at)::int  AS year,
        EXTRACT(MONTH FROM published_at)::int  AS month,
        COUNT(*)                               AS count
      FROM articles
      WHERE tenant_id = ${tenantId}
        AND status = 'PUBLISHED'
        AND published_at IS NOT NULL
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `;

    // bigint JSON'a serialize edilemez — number'a indir.
    const months = rows.map((r) => ({
      year: r.year,
      month: r.month,
      count: Number(r.count),
    }));

    // Yıl bazlı toplamları da ver ki FE ikinci istek atmasın.
    const years = months.reduce<Array<{ year: number; count: number }>>((acc, m) => {
      const hit = acc.find((y) => y.year === m.year);
      if (hit) hit.count += m.count;
      else acc.push({ year: m.year, count: m.count });
      return acc;
    }, []);

    return { years, months };
  }

  async findBySlug(tenantId: string, slug: string) {
    const article = await this.prisma.article.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
        createdBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true } },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const categoryIds = article.categories.map((ac) => ac.categoryId);

    const relatedArticles = categoryIds.length
      ? await this.prisma.article.findMany({
          where: {
            tenantId,
            id: { not: article.id },
            status: ArticleStatus.PUBLISHED,
            categories: { some: { categoryId: { in: categoryIds } } },
          },
          orderBy: { publishedAt: 'desc' },
          take: 5,
          include: {
            categories: { include: { category: true } },
            author: true,
          },
        })
      : [];

    return { ...article, relatedArticles };
  }

  async findById(tenantId: string, id: string) {
    const article = await this.prisma.article.findFirst({
      where: { id, tenantId },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
        createdBy: { select: { id: true, name: true, email: true } },
        approvedBy: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async create(
    tenantId: string,
    userId: string,
    dto: CreateArticleDto,
    userRole?: string,
  ) {
    const { categoryIds, tagNames, ...data } = dto;

    // Muhabir ve köşe yazarları haberi yayınlayamaz — DRAFT'a zorlanır.
    if (userRole && !canPublishArticle(userRole)) {
      data.status = ArticleStatus.DRAFT;
    }

    const slug = await this.generateUniqueSlug(tenantId, data.title);
    const readingTime = this.calculateReadingTime(data.content);

    const publishedAt =
      data.status === ArticleStatus.PUBLISHED && !data.publishedAt
        ? new Date()
        : data.publishedAt
          ? new Date(data.publishedAt)
          : undefined;

    const scheduledAt = data.scheduledAt
      ? new Date(data.scheduledAt)
      : undefined;

    const article = await this.prisma.article.create({
      data: {
        ...data,
        tenantId,
        slug,
        readingTime,
        createdById: userId,
        publishedAt,
        scheduledAt,
        categories: categoryIds?.length
          ? {
              create: categoryIds.map((categoryId, index) => ({
                categoryId,
                primary: index === 0,
              })),
            }
          : undefined,
        tags: tagNames?.length
          ? {
              create: await Promise.all(
                tagNames.map(async (name) => {
                  const tagSlug = slugify(name, {
                    lower: true,
                    strict: true,
                    locale: 'tr',
                  });
                  const tag = await this.prisma.tag.upsert({
                    where: { tenantId_slug: { tenantId, slug: tagSlug } },
                    update: {},
                    create: { tenantId, name, slug: tagSlug },
                  });
                  return { tagId: tag.id };
                }),
              ),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
      },
    });

    void this.audit.log({
      tenantId,
      userId,
      action: 'CREATE',
      entity: 'article',
      entityId: article.id,
      changes: { title: article.title, status: article.status },
    });

    this.revalidation.revalidateTenant(tenantId, ['articles', 'breaking-news', 'most-read']);
    return article;
  }

  async update(
    tenantId: string,
    id: string,
    dto: UpdateArticleDto,
    userId?: string,
    userRole?: string,
  ) {
    const existing = await this.findById(tenantId, id);

    // Sadece sahibi + EDITOR ve üstü başkasının haberini düzenleyebilir.
    if (userRole && !canEditAnyArticle(userRole)) {
      if (existing.createdById !== userId) {
        throw new ForbiddenException('Bu haberi düzenleme yetkiniz yok.');
      }
    }

    const { categoryIds, tagNames, publishedAt: publishedAtStr, scheduledAt: scheduledAtStr, ...rest } = dto;

    // REPORTER/COLUMNIST yayınlama gerçekleştiremez — status'ü DRAFT'a zorla.
    if (userRole && !canPublishArticle(userRole) && rest.status) {
      rest.status = ArticleStatus.DRAFT;
    }

    // Snapshot current state before mutating so admins can restore any prior
    // version. We only snapshot when content-bearing fields actually change.
    const contentBearingChanged =
      (rest.title !== undefined && rest.title !== existing.title) ||
      (rest.content !== undefined &&
        JSON.stringify(rest.content) !== JSON.stringify(existing.content)) ||
      (rest.spot !== undefined && rest.spot !== existing.spot) ||
      (rest.seoTitle !== undefined && rest.seoTitle !== existing.seoTitle) ||
      (rest.seoDesc !== undefined && rest.seoDesc !== existing.seoDesc) ||
      (rest.featuredImage !== undefined &&
        rest.featuredImage !== existing.featuredImage);
    if (contentBearingChanged) {
      await this.prisma.articleRevision.create({
        data: {
          articleId: existing.id,
          tenantId,
          editedById: userId ?? null,
          title: existing.title,
          slug: existing.slug,
          spot: existing.spot,
          content: existing.content as any,
          featuredImage: existing.featuredImage,
          seoTitle: existing.seoTitle,
          seoDesc: existing.seoDesc,
        },
      });
    }

    const updateData: Record<string, any> = { ...rest };

    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined;
    const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : undefined;

    // If transitioning to PUBLISHED and no publishedAt set
    if (
      rest.status === ArticleStatus.PUBLISHED &&
      existing.status !== ArticleStatus.PUBLISHED &&
      !publishedAt &&
      !existing.publishedAt
    ) {
      updateData.publishedAt = new Date();
    } else if (publishedAt) {
      updateData.publishedAt = publishedAt;
    }

    if (scheduledAt) {
      updateData.scheduledAt = scheduledAt;
    }

    if (rest.content) {
      updateData.readingTime = this.calculateReadingTime(rest.content);
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: {
        ...updateData,
        categories: categoryIds
          ? {
              deleteMany: {},
              create: categoryIds.map((categoryId, index) => ({
                categoryId,
                primary: index === 0,
              })),
            }
          : undefined,
        tags: tagNames
          ? {
              deleteMany: {},
              create: await Promise.all(
                tagNames.map(async (name) => {
                  const tagSlug = slugify(name, {
                    lower: true,
                    strict: true,
                    locale: 'tr',
                  });
                  const tag = await this.prisma.tag.upsert({
                    where: { tenantId_slug: { tenantId, slug: tagSlug } },
                    update: {},
                    create: { tenantId, name, slug: tagSlug },
                  });
                  return { tagId: tag.id };
                }),
              ),
            }
          : undefined,
      },
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
      },
    });

    void this.audit.log({
      tenantId,
      userId,
      action:
        rest.status === ArticleStatus.PUBLISHED &&
        existing.status !== ArticleStatus.PUBLISHED
          ? 'PUBLISH'
          : rest.status === ArticleStatus.DRAFT &&
              existing.status === ArticleStatus.PUBLISHED
            ? 'UNPUBLISH'
            : 'UPDATE',
      entity: 'article',
      entityId: article.id,
      changes: { title: article.title, status: article.status },
    });

    this.revalidation.revalidateTenant(tenantId, [
      'articles',
      `article-${article.slug}`,
      'breaking-news',
      'most-read',
    ]);
    return article;
  }

  async remove(tenantId: string, id: string, userId?: string) {
    await this.findById(tenantId, id);

    const article = await this.prisma.article.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
    });

    void this.audit.log({
      tenantId,
      userId,
      action: 'ARCHIVE',
      entity: 'article',
      entityId: id,
    });

    this.revalidation.revalidateTenant(tenantId, ['articles', 'breaking-news', 'most-read']);
    return article;
  }

  // ---------- editorial workflow ----------

  /**
   * Reporter submits a draft for editor review.
   * Only the article's creator (or an editor+) can do this. Status flips to IN_REVIEW.
   */
  async submitForReview(tenantId: string, id: string, userId: string) {
    const article = await this.findById(tenantId, id);

    if (article.createdById !== userId) {
      // Editors can force-submit for their reporters (rare, but useful).
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (!user || !canEditAnyArticle(user.role)) {
        throw new ForbiddenException('Sadece taslağın sahibi gönderebilir.');
      }
    }
    if (article.status !== ArticleStatus.DRAFT) {
      throw new ForbiddenException(
        'Yalnızca taslak durumundaki haberler incelemeye gönderilebilir.',
      );
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.IN_REVIEW,
        submittedAt: new Date(),
        reviewNote: null,
      },
      include: {
        author: true,
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await this.audit.log({
      tenantId,
      userId,
      action: 'UPDATE',
      entity: 'article',
      entityId: id,
      changes: { workflow: 'submitted' },
    });

    return updated;
  }

  /**
   * Editor approves an article — flips to PUBLISHED (or SCHEDULED if scheduledAt in the future).
   * Only EDITOR+ can approve.
   */
  async approve(tenantId: string, id: string, userId: string, userRole: string) {
    if (!canPublishArticle(userRole)) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok.');
    }
    const article = await this.findById(tenantId, id);
    if (article.status !== ArticleStatus.IN_REVIEW && article.status !== ArticleStatus.DRAFT) {
      throw new ForbiddenException(
        'Sadece taslak / inceleme bekleyen haberler onaylanabilir.',
      );
    }

    const now = new Date();
    const willSchedule =
      !!article.scheduledAt && new Date(article.scheduledAt) > now;

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        status: willSchedule
          ? ArticleStatus.SCHEDULED
          : ArticleStatus.PUBLISHED,
        publishedAt: article.publishedAt ?? (willSchedule ? null : now),
        approvedById: userId,
        reviewedAt: now,
        reviewNote: null,
      },
    });

    await this.audit.log({
      tenantId,
      userId,
      action: willSchedule ? 'UPDATE' : 'PUBLISH',
      entity: 'article',
      entityId: id,
      changes: { workflow: 'approved', status: updated.status },
    });

    return updated;
  }

  /**
   * Editor rejects an article with a required note explaining why.
   * Sends the article back to DRAFT.
   */
  async reject(
    tenantId: string,
    id: string,
    userId: string,
    userRole: string,
    note: string,
  ) {
    if (!canPublishArticle(userRole)) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok.');
    }
    if (!note?.trim()) {
      throw new ForbiddenException('Reddederken bir sebep yazmalısınız.');
    }
    const article = await this.findById(tenantId, id);
    if (article.status !== ArticleStatus.IN_REVIEW) {
      throw new ForbiddenException(
        'Sadece inceleme bekleyen haberler reddedilebilir.',
      );
    }

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        status: ArticleStatus.DRAFT,
        reviewedAt: new Date(),
        reviewNote: note.trim(),
      },
    });

    await this.audit.log({
      tenantId,
      userId,
      action: 'REJECT',
      entity: 'article',
      entityId: id,
      changes: { workflow: 'rejected', note: note.trim() },
    });

    return updated;
  }

  /**
   * Editor assigns an article/task to a reporter and optionally sets a deadline.
   */
  async assign(
    tenantId: string,
    id: string,
    userId: string,
    userRole: string,
    payload: { assignedToId: string | null; deadline?: string | null },
  ) {
    if (!canEditAnyArticle(userRole)) {
      throw new ForbiddenException('Bu işlem için yetkiniz yok.');
    }
    await this.findById(tenantId, id);

    const updated = await this.prisma.article.update({
      where: { id },
      data: {
        assignedToId: payload.assignedToId,
        deadline:
          payload.deadline === undefined
            ? undefined
            : payload.deadline
              ? new Date(payload.deadline)
              : null,
      },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
      },
    });

    await this.audit.log({
      tenantId,
      userId,
      action: 'UPDATE',
      entity: 'article',
      entityId: id,
      changes: {
        assignedToId: payload.assignedToId,
        deadline: payload.deadline ?? null,
      },
    });

    return updated;
  }

  /**
   * Reporter's personal queue — items assigned to them OR drafts they created.
   */
  async myTasks(tenantId: string, userId: string) {
    return this.prisma.article.findMany({
      where: {
        tenantId,
        status: { in: [ArticleStatus.DRAFT, ArticleStatus.IN_REVIEW] },
        OR: [{ assignedToId: userId }, { createdById: userId }],
      },
      orderBy: [
        { deadline: 'asc' },
        { updatedAt: 'desc' },
      ],
      take: 100,
      include: {
        author: { select: { id: true, name: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Editor's review queue — everything currently IN_REVIEW.
   */
  async reviewQueue(tenantId: string) {
    return this.prisma.article.findMany({
      where: { tenantId, status: ArticleStatus.IN_REVIEW },
      orderBy: { submittedAt: 'asc' },
      take: 100,
      include: {
        author: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true, email: true } },
        assignedTo: { select: { id: true, name: true } },
      },
    });
  }

  async listRevisions(tenantId: string, id: string) {
    await this.findById(tenantId, id);
    return this.prisma.articleRevision.findMany({
      where: { articleId: id, tenantId },
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        editedBy: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async restoreRevision(
    tenantId: string,
    articleId: string,
    revisionId: string,
    userId?: string,
  ) {
    const revision = await this.prisma.articleRevision.findFirst({
      where: { id: revisionId, articleId, tenantId },
    });
    if (!revision) {
      throw new NotFoundException('Revision not found');
    }
    // Restoring is itself an edit → the update method will snapshot the current
    // state before overwriting, so restores are also reversible.
    return this.update(
      tenantId,
      articleId,
      {
        title: revision.title,
        spot: revision.spot ?? undefined,
        content: revision.content as any,
        featuredImage: revision.featuredImage ?? undefined,
        seoTitle: revision.seoTitle ?? undefined,
        seoDesc: revision.seoDesc ?? undefined,
      } as any,
      userId,
    );
  }

  async incrementViewCount(tenantId: string, id: string) {
    return this.prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  /**
   * Bir haberin ilişkili haberlerini bul:
   *  - Aynı kategori(ler)den, aynı etiket(ler)den, kendisi hariç
   *  - Yayınlanmış olanlar, en yeniden eskiye
   */
  async getRelated(tenantId: string, articleId: string, limit = 5) {
    const article = await this.prisma.article.findFirst({
      where: { id: articleId, tenantId },
      include: {
        categories: { select: { categoryId: true } },
        tags: { select: { tagId: true } },
      },
    });
    if (!article) return [];

    const categoryIds = article.categories.map((c) => c.categoryId);
    const tagIds = article.tags.map((t) => t.tagId);

    return this.prisma.article.findMany({
      where: {
        tenantId,
        status: ArticleStatus.PUBLISHED,
        id: { not: articleId },
        OR: [
          categoryIds.length > 0
            ? { categories: { some: { categoryId: { in: categoryIds } } } }
            : {},
          tagIds.length > 0
            ? { tags: { some: { tagId: { in: tagIds } } } }
            : {},
        ].filter((c) => Object.keys(c).length > 0),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      include: {
        categories: { include: { category: true } },
        author: { select: { id: true, name: true, slug: true, avatar: true } },
      },
    });
  }

  async getMostRead(tenantId: string, limit = 10) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.article.findMany({
      where: {
        tenantId,
        status: ArticleStatus.PUBLISHED,
        publishedAt: { gte: sevenDaysAgo },
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
      include: {
        categories: { include: { category: true } },
        author: true,
      },
    });
  }

  async getByCategory(
    tenantId: string,
    categorySlug: string,
    cursor?: string,
    limit = 20,
  ) {
    const items = await this.prisma.article.findMany({
      where: {
        tenantId,
        status: ArticleStatus.PUBLISHED,
        categories: { some: { category: { slug: categorySlug } } },
      },
      orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
        author: true,
      },
    });

    let nextCursor: string | undefined;
    if (items.length > limit) {
      const next = items.pop();
      nextCursor = next!.id;
    }

    return { items, nextCursor };
  }

  async bulkUpdateStatus(tenantId: string, ids: string[], status: ArticleStatus) {
    return this.prisma.article.updateMany({
      where: { id: { in: ids }, tenantId },
      data: {
        status,
        ...(status === ArticleStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
      },
    });
  }

  async bulkDelete(tenantId: string, ids: string[]) {
    return this.prisma.article.updateMany({
      where: { id: { in: ids }, tenantId },
      data: { status: ArticleStatus.ARCHIVED },
    });
  }

  async bulkUpdateCategory(tenantId: string, ids: string[], categoryId: string) {
    await this.prisma.articleCategory.deleteMany({
      where: { articleId: { in: ids } },
    });

    const creates = ids.map((articleId) => ({
      articleId,
      categoryId,
      primary: true,
    }));

    return this.prisma.articleCategory.createMany({ data: creates });
  }

  // ─── Private helpers ───

  private async generateUniqueSlug(
    tenantId: string,
    title: string,
  ): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true, locale: 'tr' });

    const existing = await this.prisma.article.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return slug;
  }

  private calculateReadingTime(content: Record<string, any>): number {
    const text = this.extractTextFromContent(content);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  }

  private extractTextFromContent(node: any): string {
    if (typeof node === 'string') return node;
    if (!node || typeof node !== 'object') return '';

    if (node.text) return node.text;

    if (Array.isArray(node.content)) {
      return node.content.map((n: any) => this.extractTextFromContent(n)).join(' ');
    }

    if (Array.isArray(node)) {
      return node.map((n: any) => this.extractTextFromContent(n)).join(' ');
    }

    return '';
  }
}
