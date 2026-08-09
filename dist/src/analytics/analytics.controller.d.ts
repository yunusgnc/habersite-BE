import type { Response } from 'express';
import { AnalyticsService } from './analytics.service';
import { ReportsService, type ReportType } from './reports.service';
export declare class AnalyticsController {
    private readonly service;
    private readonly reports;
    constructor(service: AnalyticsService, reports: ReportsService);
    reportsMeta(): {
        type: string;
        title: string;
        columns: import("./reports.service").ReportColumn[];
    }[];
    runReport(tenantId: string, type: string, search?: string, from?: string, to?: string, status?: string): Promise<{
        type: ReportType;
        columns: import("./reports.service").ReportColumn[];
        rows: {
            [x: string]: string | number | boolean | null;
        }[];
        total: number;
    }>;
    exportReport(tenantId: string, type: string, search: string | undefined, from: string | undefined, to: string | undefined, status: string | undefined, columns: string | undefined, res: Response): Promise<void>;
    overview(tenantId: string, range?: string): Promise<{
        range: "30d" | "7d" | "all" | "90d" | "1y";
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
    topArticles(tenantId: string, range?: string, limit?: string): Promise<{
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
    byAuthor(tenantId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        articleCount: number;
    }[]>;
    byStatus(tenantId: string): Promise<Record<string, number>>;
    commentBreakdown(tenantId: string): Promise<Record<string, number>>;
    publishTimeSeries(tenantId: string, range?: string): Promise<{
        date: string;
        count: number;
    }[]>;
    exportCsv(tenantId: string, report: string, range: string | undefined, res: Response): Promise<void>;
}
