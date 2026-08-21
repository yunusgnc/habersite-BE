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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
function rangeStart(range) {
    const now = new Date();
    switch (range) {
        case '7d':
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case '30d':
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case '90d':
            return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        case '1y':
            return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        case 'all':
        default:
            return null;
    }
}
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview(tenantId, range = '30d') {
        const since = rangeStart(range);
        const rangeFilter = since ? { createdAt: { gte: since } } : {};
        const publishedFilter = since
            ? { publishedAt: { gte: since }, status: client_1.ArticleStatus.PUBLISHED }
            : { status: client_1.ArticleStatus.PUBLISHED };
        const [totalArticles, publishedArticles, articlesInRange, totalViews, viewsInRange, totalComments, pendingComments, totalMedia, mediaBytes, totalUsers, totalAuthors, totalCategories, totalSubscribers, subscribersInRange, totalVideos, totalGalleries, contactMessages, unreadMessages,] = await Promise.all([
            this.prisma.article.count({ where: { tenantId } }),
            this.prisma.article.count({
                where: { tenantId, status: client_1.ArticleStatus.PUBLISHED },
            }),
            this.prisma.article.count({ where: { tenantId, ...publishedFilter } }),
            this.aggregateViews(tenantId),
            this.aggregateViews(tenantId, since),
            this.prisma.comment.count({ where: { tenantId } }),
            this.prisma.comment.count({
                where: { tenantId, status: client_1.CommentStatus.PENDING },
            }),
            this.prisma.media.count({ where: { tenantId } }),
            this.aggregateMediaBytes(tenantId),
            this.prisma.user.count({ where: { tenantId } }),
            this.prisma.author.count({ where: { tenantId } }),
            this.prisma.category.count({ where: { tenantId } }),
            this.prisma.newsletterSubscriber.count({ where: { tenantId } }),
            this.prisma.newsletterSubscriber.count({
                where: { tenantId, ...rangeFilter },
            }),
            this.prisma.video.count({ where: { tenantId } }),
            this.prisma.gallery.count({ where: { tenantId } }),
            this.prisma.contactMessage.count({ where: { tenantId } }),
            this.prisma.contactMessage.count({
                where: { tenantId, read: false },
            }),
        ]);
        return {
            range,
            generatedAt: new Date().toISOString(),
            articles: {
                total: totalArticles,
                published: publishedArticles,
                publishedInRange: articlesInRange,
            },
            views: {
                total: totalViews,
                inRange: viewsInRange,
            },
            comments: {
                total: totalComments,
                pending: pendingComments,
            },
            media: {
                total: totalMedia,
                totalBytes: mediaBytes,
            },
            users: totalUsers,
            authors: totalAuthors,
            categories: totalCategories,
            newsletter: {
                total: totalSubscribers,
                inRange: subscribersInRange,
            },
            videos: totalVideos,
            galleries: totalGalleries,
            contactMessages: { total: contactMessages, unread: unreadMessages },
        };
    }
    async topArticles(tenantId, range = '30d', limit = 20) {
        const since = rangeStart(range);
        const items = await this.prisma.article.findMany({
            where: {
                tenantId,
                status: client_1.ArticleStatus.PUBLISHED,
                ...(since ? { publishedAt: { gte: since } } : {}),
            },
            orderBy: { viewCount: 'desc' },
            take: limit,
            select: {
                id: true,
                title: true,
                slug: true,
                viewCount: true,
                publishedAt: true,
                author: { select: { name: true } },
                categories: {
                    select: { primary: true, category: { select: { name: true, slug: true } } },
                },
            },
        });
        return items.map((a, i) => {
            const primary = a.categories.find((c) => c.primary) ?? a.categories[0] ?? null;
            return {
                rank: i + 1,
                id: a.id,
                title: a.title,
                slug: a.slug,
                views: a.viewCount,
                publishedAt: a.publishedAt,
                authorName: a.author?.name ?? null,
                categoryName: primary?.category?.name ?? null,
            };
        });
    }
    async byCategory(tenantId) {
        const cats = await this.prisma.category.findMany({
            where: { tenantId },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: { select: { articles: true } },
            },
            orderBy: { name: 'asc' },
        });
        return cats
            .map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            articleCount: c._count.articles,
        }))
            .sort((a, b) => b.articleCount - a.articleCount);
    }
    async byAuthor(tenantId, limit = 20) {
        const authors = await this.prisma.author.findMany({
            where: { tenantId },
            select: {
                id: true,
                name: true,
                slug: true,
                _count: { select: { articles: true } },
            },
        });
        return authors
            .map((a) => ({
            id: a.id,
            name: a.name,
            slug: a.slug,
            articleCount: a._count.articles,
        }))
            .filter((a) => a.articleCount > 0)
            .sort((a, b) => b.articleCount - a.articleCount)
            .slice(0, limit);
    }
    async publishTimeSeries(tenantId, range = '30d') {
        const since = rangeStart(range) ?? new Date(Date.now() - 30 * 86400_000);
        const rows = await this.prisma.$queryRaw `
      SELECT date_trunc('day', COALESCE(published_at, created_at)) AS day,
             COUNT(*)::bigint AS count
      FROM articles
      WHERE tenant_id = ${tenantId}
        AND status = 'PUBLISHED'
        AND COALESCE(published_at, created_at) >= ${since}
      GROUP BY 1
      ORDER BY 1 ASC
    `;
        const buckets = new Map();
        for (const r of rows) {
            const key = new Date(r.day).toISOString().slice(0, 10);
            buckets.set(key, Number(r.count));
        }
        const days = [];
        const start = new Date(since);
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        end.setHours(0, 0, 0, 0);
        for (let d = new Date(start); d <= end; d = new Date(d.getTime() + 86400_000)) {
            const key = d.toISOString().slice(0, 10);
            days.push({ date: key, count: buckets.get(key) ?? 0 });
        }
        return days;
    }
    async byStatus(tenantId) {
        const rows = await this.prisma.article.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { _all: true },
        });
        const map = { DRAFT: 0, PUBLISHED: 0, ARCHIVED: 0 };
        for (const r of rows)
            map[r.status] = r._count._all;
        return map;
    }
    async commentBreakdown(tenantId) {
        const rows = await this.prisma.comment.groupBy({
            by: ['status'],
            where: { tenantId },
            _count: { _all: true },
        });
        const map = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
            SPAM: 0,
        };
        for (const r of rows)
            map[r.status] = r._count._all;
        return map;
    }
    async aggregateViews(tenantId, since = null) {
        const res = await this.prisma.article.aggregate({
            where: {
                tenantId,
                ...(since ? { publishedAt: { gte: since } } : {}),
            },
            _sum: { viewCount: true },
        });
        return res._sum.viewCount ?? 0;
    }
    async aggregateMediaBytes(tenantId) {
        const res = await this.prisma.media.aggregate({
            where: { tenantId },
            _sum: { size: true },
        });
        return Number(res._sum.size ?? 0);
    }
    async csv(tenantId, report, range = '30d') {
        switch (report) {
            case 'top-articles': {
                const rows = await this.topArticles(tenantId, range, 500);
                return {
                    filename: `top-articles-${range}.csv`,
                    body: toCsv(['Sıra', 'Başlık', 'Slug', 'Yazar', 'Kategori', 'Görüntülenme', 'Yayın Tarihi'], rows.map((r) => [
                        r.rank,
                        r.title,
                        r.slug,
                        r.authorName ?? '',
                        r.categoryName ?? '',
                        r.views,
                        formatDate(r.publishedAt),
                    ])),
                };
            }
            case 'by-category': {
                const rows = await this.byCategory(tenantId);
                return {
                    filename: 'articles-by-category.csv',
                    body: toCsv(['Kategori', 'Slug', 'Haber Sayısı'], rows.map((r) => [r.name, r.slug, r.articleCount])),
                };
            }
            case 'by-author': {
                const rows = await this.byAuthor(tenantId, 500);
                return {
                    filename: 'articles-by-author.csv',
                    body: toCsv(['Yazar', 'Slug', 'Haber Sayısı'], rows.map((r) => [r.name, r.slug, r.articleCount])),
                };
            }
            case 'publish-timeseries': {
                const rows = await this.publishTimeSeries(tenantId, range);
                return {
                    filename: `publish-timeseries-${range}.csv`,
                    body: toCsv(['Tarih', 'Yayınlanan Haber'], rows.map((r) => [r.date, r.count])),
                };
            }
            case 'overview': {
                const o = await this.overview(tenantId, range);
                return {
                    filename: `overview-${range}.csv`,
                    body: toCsv(['Metrik', 'Değer'], [
                        ['Toplam Haber', o.articles.total],
                        ['Yayında', o.articles.published],
                        [`Bu Dönemde Yayınlanan (${o.range})`, o.articles.publishedInRange],
                        ['Toplam Görüntülenme', o.views.total],
                        [`Bu Dönemde Görüntülenme (${o.range})`, o.views.inRange],
                        ['Toplam Yorum', o.comments.total],
                        ['Bekleyen Yorum', o.comments.pending],
                        ['Toplam Medya Dosyası', o.media.total],
                        ['Medya Toplam Boyut (MB)', (o.media.totalBytes / 1024 / 1024).toFixed(2)],
                        ['Toplam Kullanıcı', o.users],
                        ['Toplam Yazar', o.authors],
                        ['Toplam Kategori', o.categories],
                        ['Toplam Bülten Abonesi', o.newsletter.total],
                        [`Bu Dönemde Abone (${o.range})`, o.newsletter.inRange],
                        ['Toplam Video', o.videos],
                        ['Toplam Galeri', o.galleries],
                        ['Toplam Mesaj', o.contactMessages.total],
                        ['Okunmamış Mesaj', o.contactMessages.unread],
                    ]),
                };
            }
            default:
                throw new Error(`Unknown report: ${report}`);
        }
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
function formatDate(d) {
    if (!d)
        return '';
    const date = new Date(d);
    if (isNaN(date.getTime()))
        return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function csvEscape(value) {
    if (value === null || value === undefined)
        return '';
    const s = String(value);
    if (/[",\n]/.test(s))
        return `"${s.replace(/"/g, '""')}"`;
    return s;
}
function toCsv(headers, rows) {
    const lines = [
        headers.map(csvEscape).join(','),
        ...rows.map((r) => r.map(csvEscape).join(',')),
    ];
    return '﻿' + lines.join('\n');
}
//# sourceMappingURL=analytics.service.js.map