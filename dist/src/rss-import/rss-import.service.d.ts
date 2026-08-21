import { PrismaService } from '../prisma/prisma.service';
import { CreateRssSourceDto, UpdateRssSourceDto } from './dto/rss-source.dto';
export declare class RssImportService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    list(tenantId: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        url: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }[]>;
    get(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        url: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }>;
    create(tenantId: string, dto: CreateRssSourceDto): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        url: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }>;
    update(tenantId: string, id: string, dto: UpdateRssSourceDto): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        url: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    pollDueSources(): Promise<void>;
    fetchOne(tenantId: string, id: string): Promise<{
        imported: number;
        skipped: number;
    }>;
}
