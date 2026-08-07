export type StoredFile = {
    url: string;
    key: string;
};
export type PutOptions = {
    tenantId: string;
    filename: string;
    mimeType: string;
    size: number;
    sourcePath?: string;
    buffer?: Buffer;
};
export interface StorageAdapter {
    put(opts: PutOptions): Promise<StoredFile>;
    delete(key: string): Promise<void>;
}
