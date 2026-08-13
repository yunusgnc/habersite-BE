import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, options?: {
        cursor?: string;
        limit?: number;
        entity?: string;
    }): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        tenantId: string;
        ipAddress: string | null;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
    })[]>;
    create(data: {
        tenantId: string;
        userId?: string;
        action: string;
        entity: string;
        entityId?: string;
        changes?: any;
        ipAddress?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        tenantId: string;
        ipAddress: string | null;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
