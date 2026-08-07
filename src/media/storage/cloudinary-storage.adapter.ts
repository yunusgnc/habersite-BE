import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { Injectable, Logger } from '@nestjs/common';
import { StorageAdapter, PutOptions, StoredFile } from './storage.types';

/**
 * Cloudinary storage. Enabled by setting `STORAGE_DRIVER=cloudinary` plus:
 *
 *   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 *
 * The `cloudinary` SDK is loaded lazily — no need to install unless used.
 */
@Injectable()
export class CloudinaryStorageAdapter implements StorageAdapter {
  private readonly logger = new Logger(CloudinaryStorageAdapter.name);
  private sdk: any;

  private async getSdk() {
    if (this.sdk) return this.sdk;
    let mod: any;
    try {
      // @ts-ignore — optional dependency, only required when STORAGE_DRIVER=cloudinary
      mod = await import('cloudinary');
    } catch {
      throw new Error(
        'CloudinaryStorageAdapter requires "cloudinary" — run `npm i cloudinary`',
      );
    }
    const { v2 } = mod;
    v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    this.sdk = v2;
    return this.sdk;
  }

  async put(opts: PutOptions): Promise<StoredFile> {
    const sdk = await this.getSdk();
    const folder = `habersite/${opts.tenantId}`;

    // Cloudinary uploader.upload string path bekliyor; buffer geldiğinde
    // önce geçici bir dosyaya yazıp öyle upload ediyoruz.
    const os = await import('os');
    let uploadPath: string;
    let tempCreated = false;
    if (opts.sourcePath) {
      uploadPath = opts.sourcePath;
    } else if (opts.buffer) {
      const tmp = `${os.tmpdir()}/gp-upload-${Date.now()}-${randomUUID()}`;
      fs.writeFileSync(tmp, opts.buffer);
      uploadPath = tmp;
      tempCreated = true;
    } else {
      throw new Error('CloudinaryStorageAdapter: buffer veya sourcePath gerekli');
    }

    const result = await sdk.uploader.upload(uploadPath, {
      folder,
      resource_type: opts.mimeType.startsWith('video/') ? 'video' : 'image',
    });

    if (tempCreated || opts.sourcePath) {
      try {
        fs.unlinkSync(uploadPath);
      } catch {}
    }

    return {
      url: result.secure_url,
      key: result.public_id, // Cloudinary uses public_id for deletion
    };
  }

  async delete(key: string): Promise<void> {
    try {
      const sdk = await this.getSdk();
      await sdk.uploader.destroy(key);
    } catch (e: any) {
      this.logger.warn(`Cloudinary delete failed for ${key}: ${e?.message ?? e}`);
    }
  }
}
