export interface AiCompletionRequest {
    system: string;
    user: string;
    schema: Record<string, any>;
    maxTokens: number;
}
export interface AiProviderAdapter {
    readonly name: string;
    readonly defaultModel: string;
    complete(req: AiCompletionRequest): Promise<Record<string, any>>;
}
export declare class AiProviderError extends Error {
    readonly provider: string;
    constructor(message: string, provider: string);
}
