import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { StorageAdapter, PutOptions, StoredFile } from './storage.types';

/**
 * Filesystem-backed storage. Files live under `uploads/<tenantId>/<yyyy>/<mm>/`
 * and are served by Nest's ServeStaticModule (or whatever proxy handles the
 * `/uploads` prefix in front of it).
 */
@Injectable()
export class LocalStorageAdapter implements StorageAdapter {
  async put(opts: PutOptions): Promise<StoredFile> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const ext = path.extname(opts.filename);
    const uniqueName = `${randomUUID()}${ext}`;

    const relativeDir = path.join('uploads', opts.tenantId, String(year), month);
    const absoluteDir = path.join(process.cwd(), relativeDir);
    fs.mkdirSync(absoluteDir, { recursive: true });

    const absolutePath = path.join(absoluteDir, uniqueName);
    if (opts.buffer) {
      fs.writeFileSync(absolutePath, opts.buffer);
    } else if (opts.sourcePath) {
      fs.renameSync(opts.sourcePath, absolutePath);
    } else {
      throw new Error('LocalStorageAdapter: buffer veya sourcePath gerekli');
    }

    const key = `${relativeDir}/${uniqueName}`;
    const url = `/${key}`;
    return { url, key };
  }

  async delete(key: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), key);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  }
}
