import { StorageAdapter, PutOptions, StoredFile } from './storage.types';
export declare class CloudinaryStorageAdapter implements StorageAdapter {
    private readonly logger;
    private sdk;
    private getSdk;
    put(opts: PutOptions): Promise<StoredFile>;
    delete(key: string): Promise<void>;
}
