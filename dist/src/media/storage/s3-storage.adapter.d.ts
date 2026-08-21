import { StorageAdapter, PutOptions, StoredFile } from './storage.types';
export declare class S3StorageAdapter implements StorageAdapter {
    private readonly logger;
    private client;
    private getClient;
    put(opts: PutOptions): Promise<StoredFile>;
    delete(key: string): Promise<void>;
}
