export declare const SECRET_SETTING_KEYS: Set<string>;
export type AiProvider = 'anthropic' | 'openai';
export declare const AI_PROVIDER_SETTING_KEY = "aiProvider";
export declare const AI_PROVIDER_KEY_SETTING: Record<AiProvider, string>;
export declare function normalizeAiProvider(value: unknown): AiProvider;
export declare function isSecretSettingKey(key: string): boolean;
export declare function secretHint(plain: string): string;
