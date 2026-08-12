import { AuditLogService } from './audit-log.service';
export declare class AuditLogController {
    private auditLogService;
    constructor(auditLogService: AuditLogService);
    findAll(tenantId: string, cursor?: string, limit?: string, entity?: string): Promise<({
        user: {
            id: string;
            email: string;
            name: string;
        } | null;
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        changes: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
    })[]>;
}
