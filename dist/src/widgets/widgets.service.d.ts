import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
export declare class WidgetsService {
    private prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }[]>;
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }[]>;
    findByType(tenantId: string, type: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    } | null>;
    upsert(tenantId: string, type: string, data: {
        config?: any;
        active?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }>;
    updateCache(tenantId: string, type: string, cache: any): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }>;
    remove(tenantId: string, type: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        sortOrder: number;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }>;
}
