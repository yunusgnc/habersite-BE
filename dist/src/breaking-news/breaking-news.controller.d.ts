import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
export declare class BreakingNewsController {
    private readonly breakingNewsService;
    constructor(breakingNewsService: BreakingNewsService);
    findActive(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        url: string | null;
        active: boolean;
        sortOrder: number;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>;
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        url: string | null;
        active: boolean;
        sortOrder: number;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>;
    reorder(tenantId: string, body: {
        ids: string[];
    }): Promise<{
        updated: number;
    }>;
    create(tenantId: string, dto: CreateBreakingNewsDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        url: string | null;
        active: boolean;
        sortOrder: number;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateBreakingNewsDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        url: string | null;
        active: boolean;
        sortOrder: number;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
