import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PublicSettingsController {
    private readonly settingsService;
    private readonly prisma;
    constructor(settingsService: SettingsService, prisma: PrismaService);
    getPublic(tenantId: string): Promise<Record<string, any>>;
}
