import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly audit;
    constructor(audit: AuditService);
    list(tenantId: string, entity?: string, entityId?: string, userId?: string, limit?: string): Promise<({
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
