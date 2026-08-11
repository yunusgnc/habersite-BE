import * as fs from 'fs';
import * as path from 'path';
import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { ObjectCannedACL } from '@aws-sdk/client-s3';
import { StorageAdapter, PutOptions, StoredFile } from './storage.types';

/**
 * S3-compatible storage. Works with AWS S3, Cloudflare R2, MinIO, DigitalOcean
 * Spaces, etc. Enabled by setting `STORAGE_DRIVER=s3` plus:
 *
 *   S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
 *   S3_ENDPOINT   (optional, for non-AWS providers)
 *   S3_PUBLIC_URL (optional, CDN in front of the bucket)
 *   S3_ACL        (optional, e.g. "public-read" — BOŞ BIRAKIN R2 için)
 *
 * Cloudflare R2 örneği:
 *   STORAGE_DRIVER=s3
 *   S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
 *   S3_REGION=auto
 *   S3_BUCKET=habersite-media
 *   S3_PUBLIC_URL=https://cdn.example.com
 *   (S3_ACL tanımlanmaz — R2 ACL desteklemez)
 *
 * The @aws-sdk/client-s3 dependency is loaded lazily so that installations
 * that stay on local storage don't need it installed.
 */
@Injectable()
export class S3StorageAdapter implements StorageAdapter {
  private readonly logger = new Logger(S3StorageAdapter.name);
  private client: any;

  private async getClient() {
    if (this.client) return this.client;
    let mod: any;
    try {
      // @ts-ignore — optional dependency, only required when STORAGE_DRIVER=s3
      mod = await import('@aws-sdk/client-s3');
    } catch (e) {
      throw new Error(
        'S3StorageAdapter requires "@aws-sdk/client-s3" — run `npm i @aws-sdk/client-s3`',
      );
    }
    const { S3Client } = mod;
    this.client = new S3Client({
      region: process.env.S3_REGION ?? 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
      },
      // AWS SDK v3.729+ varsayılan olarak her isteğe CRC32 checksum başlığı
      // ekliyor; R2 ve diğer S3-uyumlu servisler bunu reddedebiliyor.
      // "WHEN_REQUIRED" yalnızca protokolün zorunlu kıldığı yerde gönderir —
      // gerçek S3 için de güvenli.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
    return this.client;
  }

  async put(opts: PutOptions): Promise<StoredFile> {
    // @ts-ignore — optional dependency
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    const client = await this.getClient();

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ext = path.extname(opts.filename);
    const key = `uploads/${opts.tenantId}/${year}/${month}/${randomUUID()}${ext}`;

    const body = opts.buffer ?? (opts.sourcePath ? fs.createReadStream(opts.sourcePath) : undefined);
    if (!body) {
      throw new Error('S3StorageAdapter: buffer veya sourcePath gerekli');
    }

    // R2 "aws-chunked" streaming yüklemeyi desteklemiyor; boyutu önceden
    // bildirmek gerekiyor. Buffer'da gerçek uzunluğu kullan — opts.size
    // yanlışsa istek reddedilir.
    const contentLength = opts.buffer
      ? opts.buffer.length
      : opts.sourcePath
        ? fs.statSync(opts.sourcePath).size
        : opts.size;

    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: opts.mimeType,
        ContentLength: contentLength,
        // Cloudflare R2 ACL DESTEKLEMEZ — parametre gönderilirse istek
        // reddedilir. R2'de erişim bucket'ın public/custom domain ayarıyla
        // verilir. Gerçek S3 kullananlar S3_ACL=public-read tanımlayabilir.
        ...(process.env.S3_ACL
          ? { ACL: process.env.S3_ACL as ObjectCannedACL }
          : {}),
      }),
    );

    // Cleanup temp file (only if sourcePath was used)
    if (opts.sourcePath) {
      try {
        fs.unlinkSync(opts.sourcePath);
      } catch {}
    }

    const url = process.env.S3_PUBLIC_URL
      ? `${process.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`
      : `https://${process.env.S3_BUCKET}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;
    return { url, key };
  }

  async delete(key: string): Promise<void> {
    try {
      // @ts-ignore — optional dependency
      const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
      const client = await this.getClient();
      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        }),
      );
    } catch (e: any) {
      this.logger.warn(`S3 delete failed for ${key}: ${e?.message ?? e}`);
    }
  }
}
