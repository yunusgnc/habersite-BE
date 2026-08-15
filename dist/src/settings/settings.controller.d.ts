import { SettingsService } from './settings.service';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(tenantId: string): Promise<Record<string, any>>;
    getSecretStatus(tenantId: string): Promise<Record<string, {
        configured: boolean;
        hint: string | null;
    }>>;
    get(tenantId: string, key: string): Promise<any>;
    bulkUpsert(tenantId: string, dto: BulkUpdateSettingsDto): Promise<{
        updated: string[];
        removed: string[];
    }>;
    upsert(tenantId: string, key: string, dto: UpdateSettingDto): Promise<{
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
}
