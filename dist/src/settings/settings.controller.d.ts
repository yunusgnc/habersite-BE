import { SettingsService } from './settings.service';
import { UpdateSettingDto, BulkUpdateSettingsDto } from './dto/update-settings.dto';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getAll(tenantId: string): Promise<Record<string, any>>;
    get(tenantId: string, key: string): Promise<any>;
    bulkUpsert(tenantId: string, dto: BulkUpdateSettingsDto): Promise<{
        id: string;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    upsert(tenantId: string, key: string, dto: UpdateSettingDto): Promise<{
        id: string;
        tenantId: string;
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
