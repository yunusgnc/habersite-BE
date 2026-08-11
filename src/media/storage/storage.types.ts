export type StoredFile = {
  /** Public URL to serve the file. */
  url: string;
  /** Storage key/path — used to delete the file later. */
  key: string;
};

export type PutOptions = {
  tenantId: string;
  /** Original filename with extension, used to build a stable key. */
  filename: string;
  mimeType: string;
  size: number;
  /** Absolute path on disk where the incoming file is currently living. */
  sourcePath?: string;
  /** Alternatif: dosya içeriğini doğrudan buffer olarak sağla (memoryStorage). */
  buffer?: Buffer;
  /**
   * Bu tenant'a özel public taban adresi — ör. "https://cdn.kayseritimes.com".
   * Her müşterinin kendi CDN domaini olabildiği için URL'i tek bir global
   * env'den üretemiyoruz. Verilmezse adaptör kendi varsayılanına düşer.
   */
  publicBaseUrl?: string | null;
};

export interface StorageAdapter {
  /** Move a locally-uploaded file into the storage backend and return its URL/key. */
  put(opts: PutOptions): Promise<StoredFile>;
  /** Remove a file by the key returned from `put`. */
  delete(key: string): Promise<void>;
}
