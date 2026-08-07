import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleType, CommentStatus } from '@prisma/client';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(tenantId: string) {
    const [
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
    ] = await Promise.all([
      this.prisma.article.count({ where: { tenantId } }),
      this.prisma.article.count({
        where: { tenantId, type: ArticleType.COLUMN },
      }),
      this.prisma.media.count({ where: { tenantId } }),
      this.prisma.comment.count({
        where: { tenantId, status: CommentStatus.PENDING },
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
}
