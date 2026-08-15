import { AiCompletionRequest, AiProviderAdapter } from '../ai.types';
export declare const OPENAI_DEFAULT_MODEL = "gpt-4o-mini";
export declare class OpenAiAdapter implements AiProviderAdapter {
    private readonly apiKey;
    private readonly model;
    readonly name = "openai";
    readonly defaultModel = "gpt-4o-mini";
    constructor(apiKey: string, model: string);
    complete(req: AiCompletionRequest): Promise<Record<string, any>>;
    private describe;
}
