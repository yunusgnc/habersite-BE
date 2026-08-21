import { AiCompletionRequest, AiProviderAdapter } from '../ai.types';
export declare const ANTHROPIC_DEFAULT_MODEL = "claude-haiku-4-5-20251001";
export declare class AnthropicAdapter implements AiProviderAdapter {
    private readonly apiKey;
    private readonly model;
    readonly name = "anthropic";
    readonly defaultModel = "claude-haiku-4-5-20251001";
    constructor(apiKey: string, model: string);
    complete(req: AiCompletionRequest): Promise<Record<string, any>>;
}
