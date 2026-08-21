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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ArticlesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_service_1 = require("../common/audit/audit.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
function canPublishArticle(role) {
    return ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role);
}
function canEditAnyArticle(role) {
    return ['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(role);
}
function buildDateRange(from, to) {
    const filter = {};
    if (from) {
        const d = new Date(from);
        if (!Number.isNaN(d.getTime()))
            filter.gte = d;
    }
    if (to) {
        const d = new Date(to);
        if (!Number.isNaN(d.getTime())) {
            if (d.getUTCHours() === 0 && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0) {
                d.setUTCHours(23, 59, 59, 999);
            }
            filter.lte = d;
        }
    }
    return Object.keys(filter).length ? filter : undefined;
}
let ArticlesService = ArticlesService_1 = class ArticlesService {
    prisma;
    audit;
    revalidation;
    logger = new common_1.Logger(ArticlesService_1.name);
    constructor(prisma, audit, revalidation) {
        this.prisma = prisma;
        this.audit = audit;
        this.revalidation = revalidation;
    }
    async publishScheduled() {
        const now = new Date();
        const due = await this.prisma.article.findMany({
            where: {
                status: client_1.ArticleStatus.DRAFT,
                scheduledAt: { lte: now, not: null },
            },
            select: { id: true, tenantId: true, scheduledAt: true, title: true },
            take: 100,
        });
        if (due.length === 0)
            return;
        await Promise.all(due.map(async (a) => {
            try {
                await this.prisma.article.update({
                    where: { id: a.id },
                    data: {
                        status: client_1.ArticleStatus.PUBLISHED,
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
            }
            catch (err) {
                this.logger.warn(`Zamanlanmış yayın başarısız (${a.id}): ${err.message}`);
            }
        }));
        this.logger.log(`${due.length} zamanlanmış haber yayınlandı.`);
    }
    async findAll(tenantId, query) {
        const { cursor, limit = 20, status, type, categorySlug, categoryId, authorSlug, page, search, searchScope, from, to, tagSlug, featured, createdById, sort = 'latest', } = query;
        const where = { tenantId };
        if (status)
            where.status = status;
        if (type)
            where.type = type;
        if (featured)
            where.featured = featured === 'true';
        if (createdById)
            where.createdById = createdById;
        if (search?.trim()) {
            const q = search.trim();
            where.AND = [
                ...(Array.isArray(where.AND) ? where.AND : where.AND ? [where.AND] : []),
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
        const publishedRange = buildDateRange(from, to);
        if (publishedRange)
            where.publishedAt = publishedRange;
        if (categoryId) {
            where.categories = { some: { categoryId } };
        }
        else if (categorySlug) {
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
        let orderBy;
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
        const usePageOffset = Boolean(page && page > 0);
        const [items, total] = await Promise.all([
            this.prisma.article.findMany({
                where,
                orderBy,
                take: limit + 1,
                ...(usePageOffset
                    ? { skip: (page - 1) * limit }
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
        const hasMore = items.length > limit;
        if (hasMore)
            items.pop();
        const nextCursor = hasMore && !usePageOffset ? items[items.length - 1]?.id : undefined;
        return {
            items,
            nextCursor,
            total,
            page: usePageOffset ? page : undefined,
            totalPages: Math.max(1, Math.ceil(total / limit)),
            hasMore,
        };
    }
    async recentForNews(tenantId, limit = 1000) {
        const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
        return this.prisma.article.findMany({
            where: {
                tenantId,
                status: client_1.ArticleStatus.PUBLISHED,
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
    async sitemap(tenantId, page, perPage) {
        const where = {
            tenantId,
            status: client_1.ArticleStatus.PUBLISHED,
        };
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
    async archiveFacets(tenantId) {
        const rows = await this.prisma.$queryRaw `
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
        const months = rows.map((r) => ({
            year: r.year,
            month: r.month,
            count: Number(r.count),
        }));
        const years = months.reduce((acc, m) => {
            const hit = acc.find((y) => y.year === m.year);
            if (hit)
                hit.count += m.count;
            else
                acc.push({ year: m.year, count: m.count });
            return acc;
        }, []);
        return { years, months };
    }
    async findBySlug(tenantId, slug) {
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
            throw new common_1.NotFoundException('Article not found');
        }
        const categoryIds = article.categories.map((ac) => ac.categoryId);
        const relatedArticles = categoryIds.length
            ? await this.prisma.article.findMany({
                where: {
                    tenantId,
                    id: { not: article.id },
                    status: client_1.ArticleStatus.PUBLISHED,
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
    async findById(tenantId, id) {
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
            throw new common_1.NotFoundException('Article not found');
        }
        return article;
    }
    async create(tenantId, userId, dto, userRole) {
        const { categoryIds, tagNames, ...data } = dto;
        if (userRole && !canPublishArticle(userRole)) {
            data.status = client_1.ArticleStatus.DRAFT;
        }
        const { slug: istenenSlug, ...alanlar } = data;
        const slug = await this.generateUniqueSlug(tenantId, istenenSlug?.trim() || alanlar.title);
        const readingTime = this.calculateReadingTime(alanlar.content);
        const publishedAt = data.status === client_1.ArticleStatus.PUBLISHED && !data.publishedAt
            ? new Date()
            : data.publishedAt
                ? new Date(data.publishedAt)
                : undefined;
        const scheduledAt = data.scheduledAt
            ? new Date(data.scheduledAt)
            : undefined;
        const article = await this.prisma.article.create({
            data: {
                ...alanlar,
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
                        create: await Promise.all(tagNames.map(async (name) => {
                            const tagSlug = (0, slugify_1.default)(name, {
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
                        })),
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
    async update(tenantId, id, dto, userId, userRole) {
        const existing = await this.findById(tenantId, id);
        if (userRole && !canEditAnyArticle(userRole)) {
            if (existing.createdById !== userId) {
                throw new common_1.ForbiddenException('Bu haberi düzenleme yetkiniz yok.');
            }
        }
        const { categoryIds, tagNames, publishedAt: publishedAtStr, scheduledAt: scheduledAtStr, ...rest } = dto;
        if (userRole && !canPublishArticle(userRole) && rest.status) {
            rest.status = client_1.ArticleStatus.DRAFT;
        }
        const contentBearingChanged = (rest.title !== undefined && rest.title !== existing.title) ||
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
                    content: existing.content,
                    featuredImage: existing.featuredImage,
                    seoTitle: existing.seoTitle,
                    seoDesc: existing.seoDesc,
                },
            });
        }
        const updateData = { ...rest };
        const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined;
        const scheduledAt = scheduledAtStr ? new Date(scheduledAtStr) : undefined;
        if (rest.status === client_1.ArticleStatus.PUBLISHED &&
            existing.status !== client_1.ArticleStatus.PUBLISHED &&
            !publishedAt &&
            !existing.publishedAt) {
            updateData.publishedAt = new Date();
        }
        else if (publishedAt) {
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
                        create: await Promise.all(tagNames.map(async (name) => {
                            const tagSlug = (0, slugify_1.default)(name, {
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
                        })),
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
            action: rest.status === client_1.ArticleStatus.PUBLISHED &&
                existing.status !== client_1.ArticleStatus.PUBLISHED
                ? 'PUBLISH'
                : rest.status === client_1.ArticleStatus.DRAFT &&
                    existing.status === client_1.ArticleStatus.PUBLISHED
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
    async remove(tenantId, id, userId) {
        await this.findById(tenantId, id);
        const article = await this.prisma.article.update({
            where: { id },
            data: { status: client_1.ArticleStatus.ARCHIVED },
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
    async submitForReview(tenantId, id, userId) {
        const article = await this.findById(tenantId, id);
        if (article.createdById !== userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (!user || !canEditAnyArticle(user.role)) {
                throw new common_1.ForbiddenException('Sadece taslağın sahibi gönderebilir.');
            }
        }
        if (article.status !== client_1.ArticleStatus.DRAFT) {
            throw new common_1.ForbiddenException('Yalnızca taslak durumundaki haberler incelemeye gönderilebilir.');
        }
        const updated = await this.prisma.article.update({
            where: { id },
            data: {
                status: client_1.ArticleStatus.IN_REVIEW,
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
    async approve(tenantId, id, userId, userRole) {
        if (!canPublishArticle(userRole)) {
            throw new common_1.ForbiddenException('Bu işlem için yetkiniz yok.');
        }
        const article = await this.findById(tenantId, id);
        if (article.status !== client_1.ArticleStatus.IN_REVIEW && article.status !== client_1.ArticleStatus.DRAFT) {
            throw new common_1.ForbiddenException('Sadece taslak / inceleme bekleyen haberler onaylanabilir.');
        }
        const now = new Date();
        const willSchedule = !!article.scheduledAt && new Date(article.scheduledAt) > now;
        const updated = await this.prisma.article.update({
            where: { id },
            data: {
                status: willSchedule
                    ? client_1.ArticleStatus.SCHEDULED
                    : client_1.ArticleStatus.PUBLISHED,
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
    async reject(tenantId, id, userId, userRole, note) {
        if (!canPublishArticle(userRole)) {
            throw new common_1.ForbiddenException('Bu işlem için yetkiniz yok.');
        }
        if (!note?.trim()) {
            throw new common_1.ForbiddenException('Reddederken bir sebep yazmalısınız.');
        }
        const article = await this.findById(tenantId, id);
        if (article.status !== client_1.ArticleStatus.IN_REVIEW) {
            throw new common_1.ForbiddenException('Sadece inceleme bekleyen haberler reddedilebilir.');
        }
        const updated = await this.prisma.article.update({
            where: { id },
            data: {
                status: client_1.ArticleStatus.DRAFT,
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
    async assign(tenantId, id, userId, userRole, payload) {
        if (!canEditAnyArticle(userRole)) {
            throw new common_1.ForbiddenException('Bu işlem için yetkiniz yok.');
        }
        await this.findById(tenantId, id);
        const updated = await this.prisma.article.update({
            where: { id },
            data: {
                assignedToId: payload.assignedToId,
                deadline: payload.deadline === undefined
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
    async myTasks(tenantId, userId) {
        return this.prisma.article.findMany({
            where: {
                tenantId,
                status: { in: [client_1.ArticleStatus.DRAFT, client_1.ArticleStatus.IN_REVIEW] },
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
    async reviewQueue(tenantId) {
        return this.prisma.article.findMany({
            where: { tenantId, status: client_1.ArticleStatus.IN_REVIEW },
            orderBy: { submittedAt: 'asc' },
            take: 100,
            include: {
                author: { select: { id: true, name: true } },
                createdBy: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true } },
            },
        });
    }
    async listRevisions(tenantId, id) {
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
    async restoreRevision(tenantId, articleId, revisionId, userId) {
        const revision = await this.prisma.articleRevision.findFirst({
            where: { id: revisionId, articleId, tenantId },
        });
        if (!revision) {
            throw new common_1.NotFoundException('Revision not found');
        }
        return this.update(tenantId, articleId, {
            title: revision.title,
            spot: revision.spot ?? undefined,
            content: revision.content,
            featuredImage: revision.featuredImage ?? undefined,
            seoTitle: revision.seoTitle ?? undefined,
            seoDesc: revision.seoDesc ?? undefined,
        }, userId);
    }
    async incrementViewCount(tenantId, id) {
        return this.prisma.article.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
    async getRelated(tenantId, articleId, limit = 5) {
        const article = await this.prisma.article.findFirst({
            where: { id: articleId, tenantId },
            include: {
                categories: { select: { categoryId: true } },
                tags: { select: { tagId: true } },
            },
        });
        if (!article)
            return [];
        const categoryIds = article.categories.map((c) => c.categoryId);
        const tagIds = article.tags.map((t) => t.tagId);
        return this.prisma.article.findMany({
            where: {
                tenantId,
                status: client_1.ArticleStatus.PUBLISHED,
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
    async getMostRead(tenantId, limit = 10) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return this.prisma.article.findMany({
            where: {
                tenantId,
                status: client_1.ArticleStatus.PUBLISHED,
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
    async getByCategory(tenantId, categorySlug, cursor, limit = 20) {
        const items = await this.prisma.article.findMany({
            where: {
                tenantId,
                status: client_1.ArticleStatus.PUBLISHED,
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
        const hasMore = items.length > limit;
        if (hasMore)
            items.pop();
        const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
        return { items, nextCursor };
    }
    async bulkUpdateStatus(tenantId, ids, status) {
        return this.prisma.article.updateMany({
            where: { id: { in: ids }, tenantId },
            data: {
                status,
                ...(status === client_1.ArticleStatus.PUBLISHED ? { publishedAt: new Date() } : {}),
            },
        });
    }
    async bulkDelete(tenantId, ids) {
        return this.prisma.article.updateMany({
            where: { id: { in: ids }, tenantId },
            data: { status: client_1.ArticleStatus.ARCHIVED },
        });
    }
    async bulkUpdateCategory(tenantId, ids, categoryId) {
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
    async generateUniqueSlug(tenantId, kaynak) {
        let slug = (0, slugify_1.default)(kaynak, { lower: true, strict: true, locale: 'tr' });
        const existing = await this.prisma.article.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }
        return slug;
    }
    calculateReadingTime(content) {
        const text = this.extractTextFromContent(content);
        const wordCount = text.split(/\s+/).filter(Boolean).length;
        return Math.max(1, Math.ceil(wordCount / 200));
    }
    extractTextFromContent(node) {
        if (typeof node === 'string')
            return node;
        if (!node || typeof node !== 'object')
            return '';
        if (node.text)
            return node.text;
        if (Array.isArray(node.content)) {
            return node.content.map((n) => this.extractTextFromContent(n)).join(' ');
        }
        if (Array.isArray(node)) {
            return node.map((n) => this.extractTextFromContent(n)).join(' ');
        }
        return '';
    }
};
exports.ArticlesService = ArticlesService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_MINUTE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ArticlesService.prototype, "publishScheduled", null);
exports.ArticlesService = ArticlesService = ArticlesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        revalidation_service_1.RevalidationService])
], ArticlesService);
//# sourceMappingURL=articles.service.js.map