export declare function isEncrypted(value: unknown): value is string;
export declare function encryptSecret(plain: string): string;
export declare function decryptSecret(stored: string): string;
export declare function isEncryptionConfigured(): boolean;
