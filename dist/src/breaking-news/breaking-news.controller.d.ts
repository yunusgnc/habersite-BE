import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
export declare class BreakingNewsController {
    private readonly breakingNewsService;
    constructor(breakingNewsService: BreakingNewsService);
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
        title: string;
        url: string | null;
        expiresAt: Date | null;
    }[]>;
    findAll(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
        title: string;
        url: string | null;
        expiresAt: Date | null;
    }[]>;
    reorder(tenantId: string, body: {
        ids: string[];
    }): Promise<{
        updated: number;
    }>;
    create(tenantId: string, dto: CreateBreakingNewsDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
        title: string;
        url: string | null;
        expiresAt: Date | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateBreakingNewsDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        sortOrder: number;
        title: string;
        url: string | null;
        expiresAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
