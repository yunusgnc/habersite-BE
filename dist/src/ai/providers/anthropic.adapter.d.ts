import { AiCompletionRequest, AiProviderAdapter } from '../ai.types';
export declare const ANTHROPIC_DEFAULT_MODEL = "claude-opus-5";
export declare class AnthropicAdapter implements AiProviderAdapter {
    private readonly apiKey;
    private readonly model;
    readonly name = "anthropic";
    readonly defaultModel = "claude-opus-5";
    constructor(apiKey: string, model: string);
    complete(req: AiCompletionRequest): Promise<Record<string, any>>;
    private describe;
}
