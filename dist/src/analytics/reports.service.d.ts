import { PrismaService } from '../prisma/prisma.service';
export type ReportType = 'articles' | 'comments' | 'authors' | 'categories' | 'newsletter' | 'media' | 'messages' | 'videos' | 'galleries' | 'users';
export type ReportColumn = {
    key: string;
    label: string;
    defaultVisible?: boolean;
};
export type ReportFilters = {
    search?: string;
    from?: string;
    to?: string;
    status?: string;
};
type ReportRow = Record<string, string | number | boolean | null>;
type ReportResponse = {
    type: ReportType;
    columns: ReportColumn[];
    rows: ReportRow[];
    total: number;
};
export declare class ReportsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    meta(): {
        type: string;
        title: string;
        columns: ReportColumn[];
    }[];
    run(tenantId: string, type: ReportType, filters?: ReportFilters): Promise<ReportResponse>;
    csv(tenantId: string, type: ReportType, filters: ReportFilters, columns: string[]): Promise<{
        filename: string;
        body: string;
    }>;
    private fetch;
    private dateRange;
}
export {};
