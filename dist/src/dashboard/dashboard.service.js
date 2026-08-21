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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStats(tenantId) {
        const [totalArticles, totalColumns, totalMedia, pendingComments, totalAuthors, totalCategories, totalUsers, totalSubscribers, totalGalleries, totalVideos, totalPages, totalBreakingNews, totalAds, totalPopups, totalTags, recentArticles, recentComments,] = await Promise.all([
            this.prisma.article.count({ where: { tenantId } }),
            this.prisma.article.count({
                where: { tenantId, type: client_1.ArticleType.COLUMN },
            }),
            this.prisma.media.count({ where: { tenantId } }),
            this.prisma.comment.count({
                where: { tenantId, status: client_1.CommentStatus.PENDING },
            }),
            this.prisma.author.count({ where: { tenantId } }),
            this.prisma.category.count({ where: { tenantId } }),
            this.prisma.user.count({ where: { tenantId } }),
            this.prisma.newsletterSubscriber.count({ where: { tenantId } }),
            this.prisma.gallery.count({ where: { tenantId } }),
            this.prisma.video.count({ where: { tenantId } }),
            this.prisma.page.count({ where: { tenantId } }),
            this.prisma.breakingNews.count({ where: { tenantId } }),
            this.prisma.ad.count({ where: { tenantId } }),
            this.prisma.popup.count({ where: { tenantId } }),
            this.prisma.tag.count({ where: { tenantId } }),
            this.prisma.article.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.comment.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                take: 10,
                include: {
                    article: {
                        select: { title: true },
                    },
                },
            }),
        ]);
        return {
            totalArticles,
            totalColumns,
            totalMedia,
            pendingComments,
            totalAuthors,
            totalCategories,
            totalUsers,
            totalSubscribers,
            totalGalleries,
            totalVideos,
            totalPages,
            totalBreakingNews,
            totalAds,
            totalPopups,
            totalTags,
            recentArticles,
            recentComments,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map