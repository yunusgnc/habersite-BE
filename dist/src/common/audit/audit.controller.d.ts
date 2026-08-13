import type { Response } from 'express';
import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly audit;
    constructor(audit: AuditService);
    list(tenantId: string, entity?: string, entityId?: string, userId?: string, action?: string, search?: string, from?: string, to?: string, cursor?: string, limit?: string): Promise<{
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
            changes: import("@prisma/client/runtime/client").JsonValue | null;
        })[];
        nextCursor: string | null;
        total: number;
    }>;
    summary(tenantId: string, entity?: string, userId?: string, action?: string, from?: string, to?: string, search?: string): Promise<{
        total: number;
        byAction: {
            [k: string]: number;
        };
    }>;
    exportCsv(tenantId: string, entity: string | undefined, userId: string | undefined, action: string | undefined, search: string | undefined, from: string | undefined, to: string | undefined, res: Response): Promise<void>;
}
