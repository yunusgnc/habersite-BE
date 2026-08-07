import { Module } from '@nestjs/common';
import { StorageAdapter } from './storage.types';
import { LocalStorageAdapter } from './local-storage.adapter';
import { S3StorageAdapter } from './s3-storage.adapter';
import { CloudinaryStorageAdapter } from './cloudinary-storage.adapter';

export const STORAGE_ADAPTER = 'STORAGE_ADAPTER';

/**
 * Picks the storage backend based on the STORAGE_DRIVER env var:
 *   - "s3"         → S3-compatible bucket
 *   - "cloudinary" → Cloudinary
 *   - anything else (or unset) → local filesystem (default)
 */
@Module({
  providers: [
    LocalStorageAdapter,
    S3StorageAdapter,
    CloudinaryStorageAdapter,
    {
      provide: STORAGE_ADAPTER,
      inject: [LocalStorageAdapter, S3StorageAdapter, CloudinaryStorageAdapter],
      useFactory: (
        local: LocalStorageAdapter,
        s3: S3StorageAdapter,
        cloudinary: CloudinaryStorageAdapter,
      ): StorageAdapter => {
        const driver = (process.env.STORAGE_DRIVER ?? 'local').toLowerCase();
        if (driver === 's3') return s3;
        if (driver === 'cloudinary') return cloudinary;
        return local;
      },
    },
  ],
  exports: [STORAGE_ADAPTER],
})
export class StorageModule {}
