import { AiService } from './ai.service';
import { AssistDto } from './dto/assist.dto';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    status(tenantId: string): Promise<{
        enabled: boolean;
        provider: import("../settings/secret-settings").AiProvider;
    }>;
    assist(tenantId: string, dto: AssistDto): Promise<Record<string, any>>;
}
