import { SettingsService } from './settings.service';
export declare class PublicSettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublic(tenantId: string): Promise<Record<string, any>>;
}
