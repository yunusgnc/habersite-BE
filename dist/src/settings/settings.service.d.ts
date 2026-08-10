import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    getAll(tenantId: string): Promise<Record<string, any>>;
    get(tenantId: string, key: string): Promise<any>;
    upsert(tenantId: string, key: string, value: any): Promise<{
        id: string;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }>;
    bulkUpsert(tenantId: string, settings: Record<string, any>): Promise<{
        id: string;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
}
