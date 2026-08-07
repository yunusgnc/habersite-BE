import { PrismaService } from '../../prisma/prisma.service';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'RESTORE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'LOGOUT';
export declare class AuditService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    log(params: {
        tenantId: string;
        userId?: string | null;
        action: AuditAction;
        entity: string;
        entityId?: string;
        changes?: Record<string, any>;
        ipAddress?: string;
    }): Promise<void>;
    list(params: {
        tenantId: string;
        entity?: string;
        entityId?: string;
        userId?: string;
        limit?: number;
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
}
