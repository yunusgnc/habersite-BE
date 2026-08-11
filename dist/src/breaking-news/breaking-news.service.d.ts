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
    reorder(tenantId: string, ids: string[]): Promise<{
        updated: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
