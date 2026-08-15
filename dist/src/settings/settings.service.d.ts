import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    getAll(tenantId: string): Promise<Record<string, any>>;
    get(tenantId: string, key: string): Promise<any>;
    getSecret(tenantId: string, key: string): Promise<string | null>;
    getSecretStatus(tenantId: string): Promise<Record<string, {
        configured: boolean;
        hint: string | null;
    }>>;
    private prepareValue;
    upsert(tenantId: string, key: string, value: any): Promise<{
        id: string;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    } | {
        tenantId: string;
        key: string;
        removed: boolean;
        saved?: undefined;
    } | {
        tenantId: string;
        key: string;
        saved: boolean;
        removed?: undefined;
    }>;
    bulkUpsert(tenantId: string, settings: Record<string, any>): Promise<{
        updated: string[];
        removed: string[];
    }>;
}
