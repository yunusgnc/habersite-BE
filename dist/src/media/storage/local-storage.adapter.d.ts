import { StorageAdapter, PutOptions, StoredFile } from './storage.types';
export declare class LocalStorageAdapter implements StorageAdapter {
    put(opts: PutOptions): Promise<StoredFile>;
    delete(key: string): Promise<void>;
}
