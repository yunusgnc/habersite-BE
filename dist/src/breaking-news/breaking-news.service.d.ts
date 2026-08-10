import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
export declare class BreakingNewsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
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
    reorder(tenantId: string, ids: string[]): Promise<{
        updated: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
