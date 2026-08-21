import { RssImportService } from './rss-import.service';
import { CreateRssSourceDto, UpdateRssSourceDto } from './dto/rss-source.dto';
export declare class RssImportController {
    private readonly service;
    constructor(service: RssImportService);
    list(tenantId: string): Promise<{
        url: string;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }[]>;
    get(tenantId: string, id: string): Promise<{
        url: string;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }>;
    create(tenantId: string, dto: CreateRssSourceDto): Promise<{
        url: string;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        defaultCategoryId: string | null;
        defaultAuthorName: string | null;
        fetchIntervalMinutes: number;
        lastFetchedAt: Date | null;
        lastFetchStatus: string | null;
        itemsImported: number;
    }>;
    update(tenantId: string, id: string, dto: UpdateRssSourceDto): Promise<{
        url: string;
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
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
    fetch(tenantId: string, id: string): Promise<{
        imported: number;
        skipped: number;
    }>;
}
