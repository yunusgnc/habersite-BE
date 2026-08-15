import { AiService } from './ai.service';
import { AssistDto } from './dto/assist.dto';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    assist(tenantId: string, dto: AssistDto): Promise<Record<string, any>>;
}
