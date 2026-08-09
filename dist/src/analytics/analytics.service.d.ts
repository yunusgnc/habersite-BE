import { PrismaService } from '../prisma/prisma.service';
type Range = '7d' | '30d' | '90d' | '1y' | 'all';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    overview(tenantId: string, range?: Range): Promise<{
        range: Range;
        generatedAt: string;
        articles: {
            total: number;
            published: number;
            publishedInRange: number;
        };
        views: {
            total: number;
            inRange: number;
        };
        comments: {
            total: number;
            pending: number;
        };
        media: {
            total: number;
            totalBytes: number;
        };
        users: number;
        authors: number;
        categories: number;
        newsletter: {
            total: number;
            inRange: number;
        };
        videos: number;
        galleries: number;
        contactMessages: {
            total: number;
            unread: number;
        };
    }>;
    topArticles(tenantId: string, range?: Range, limit?: number): Promise<{
        rank: number;
        id: string;
        title: string;
        slug: string;
        views: number;
        publishedAt: Date | null;
        authorName: string | null;
        categoryName: string;
    }[]>;
    byCategory(tenantId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        articleCount: number;
    }[]>;
    byAuthor(tenantId: string, limit?: number): Promise<{
        id: string;
        name: string;
        slug: string;
        articleCount: number;
    }[]>;
    publishTimeSeries(tenantId: string, range?: Range): Promise<{
        date: string;
        count: number;
    }[]>;
    byStatus(tenantId: string): Promise<Record<string, number>>;
    commentBreakdown(tenantId: string): Promise<Record<string, number>>;
    private aggregateViews;
    private aggregateMediaBytes;
    csv(tenantId: string, report: string, range?: Range): Promise<{
        filename: string;
        body: string;
    }>;
}
export {};
