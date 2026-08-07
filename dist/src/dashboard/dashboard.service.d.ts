import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStats(tenantId: string): Promise<{
        totalArticles: number;
        totalColumns: number;
        totalMedia: number;
        pendingComments: number;
        totalAuthors: number;
        totalCategories: number;
        totalUsers: number;
        totalSubscribers: number;
        totalGalleries: number;
        totalVideos: number;
        totalPages: number;
        totalBreakingNews: number;
        totalAds: number;
        totalPopups: number;
        totalTags: number;
        recentArticles: {
            id: string;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            seoTitle: string | null;
            seoDesc: string | null;
            type: import("@prisma/client").$Enums.ArticleType;
            title: string;
            spot: string | null;
            content: import("@prisma/client/runtime/client").JsonValue;
            featuredImage: string | null;
            status: import("@prisma/client").$Enums.ArticleStatus;
            publishedAt: Date | null;
            scheduledAt: Date | null;
            authorId: string | null;
            createdById: string;
            approvedById: string | null;
            viewCount: number;
            commentCount: number;
            readingTime: number | null;
            featured: boolean;
            breakingLabel: string | null;
            canonicalUrl: string | null;
            ogImage: string | null;
            source: string | null;
            sourceUrl: string | null;
            headlineTitle: string | null;
            headlineImage: string | null;
            headlineFontSize: number | null;
            headlineFontFamily: string | null;
            nationalFeatured: boolean;
        }[];
        recentComments: ({
            article: {
                title: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string;
            email: string;
            parentId: string | null;
            content: string;
            status: import("@prisma/client").$Enums.CommentStatus;
            articleId: string;
            ipAddress: string | null;
        })[];
    }>;
}
