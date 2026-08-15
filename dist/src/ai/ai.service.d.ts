import { SettingsService } from '../settings/settings.service';
import { AiProvider } from '../settings/secret-settings';
import { AiTaskName } from './ai.tasks';
export declare class AiService {
    private readonly settings;
    private readonly logger;
    constructor(settings: SettingsService);
    private resolveAdapter;
    status(tenantId: string): Promise<{
        enabled: boolean;
        provider: AiProvider;
    }>;
    assist(tenantId: string, task: AiTaskName, input: {
        title: string;
        content?: string;
        spot?: string;
    }): Promise<Record<string, any>>;
}
