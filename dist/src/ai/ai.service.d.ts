import { SettingsService } from '../settings/settings.service';
import { AiTaskName } from './ai.tasks';
export declare class AiService {
    private readonly settings;
    private readonly logger;
    constructor(settings: SettingsService);
    private resolveAdapter;
    assist(tenantId: string, task: AiTaskName, input: {
        title: string;
        content?: string;
        spot?: string;
    }): Promise<Record<string, any>>;
}
