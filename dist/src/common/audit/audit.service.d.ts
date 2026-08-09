import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'RESTORE' | 'APPROVE' | 'REJECT' | 'LOGIN' | 'LOGOUT';
export type ListParams = {
    tenantId: string;
    entity?: string;
    entityId?: string;
    userId?: string;
    action?: string;
    search?: string;
    from?: string;
    to?: string;
    cursor?: string;
    limit?: number;
};
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
    list(params: ListParams): Promise<{
        items: ({
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
            changes: Prisma.JsonValue | null;
        })[];
        nextCursor: string | null;
        total: number;
    }>;
    summary(params: ListParams): Promise<{
        total: number;
        byAction: {
            [k: string]: number;
        };
    }>;
    exportRows(params: ListParams): Promise<({
        user: {
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
        changes: Prisma.JsonValue | null;
    })[]>;
    private buildWhere;
}
