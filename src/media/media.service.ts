import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { STORAGE_ADAPTER } from './storage/storage.module';
import type { StorageAdapter } from './storage/storage.types';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import * as path from 'path';

// İzin verilen MIME tipleri — magic byte ile eşleştirilecek.
const ALLOWED_MIMES = new Set<string>([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
]);
// SVG file-type ile detected olamıyor (text-based), o yüzden özel muamele.
const SVG_MAX_BYTES = 2 * 1024 * 1024;

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter,
  ) {}

  async findAll(tenantId: string, query: QueryMediaDto) {
    const limit = query.limit ?? 30;

    const where: Record<string, any> = { tenantId };
    if (query.type) {
      where.type = query.type;
    }

    const [items, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        take: limit + 1,
        orderBy: { createdAt: 'desc' },
        ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
      }),
      this.prisma.media.count({ where }),
    ]);

    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const nextCursor = hasMore ? data[data.length - 1].id : null;

    return { data, nextCursor, total };
  }

  async findById(tenantId: string, id: string) {
    const media = await this.prisma.media.findFirst({
      where: { id, tenantId },
    });

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }

  async create(
    tenantId: string,
    file: Express.Multer.File,
    dto: UploadMediaDto,
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException('File is required');
    }

    // 1) Magic byte kontrolü — client'ın gönderdiği MIME'a güvenmiyoruz.
    const detected = await fileTypeFromBuffer(file.buffer);
    let safeMime: string;
    let safeExt: string;

    if (detected) {
      if (!ALLOWED_MIMES.has(detected.mime)) {
        throw new BadRequestException(
          `İzin verilmeyen dosya tipi: ${detected.mime}`,
        );
      }
      safeMime = detected.mime;
      safeExt = `.${detected.ext}`;
    } else if (
      file.mimetype === 'image/svg+xml' &&
      file.buffer.length <= SVG_MAX_BYTES &&
      this.looksLikeSvg(file.buffer)
    ) {
      // SVG file-type ile detect edilemez; içerik SVG imzasını taşımalı ve
      // script/foreignObject içermemeli.
      safeMime = 'image/svg+xml';
      safeExt = '.svg';
    } else {
      throw new BadRequestException(
        'Dosya tipi tanınamadı veya izin verilmiyor',
      );
    }

    // 2) Görselleri sharp ile re-encode — EXIF strip, metadata temizliği,
    //    kötü niyetli image polyglot'ları etkisiz kılar. Thumbnail üretilir.
    let processedBuffer: Buffer = file.buffer;
    let thumbnailBuffer: Buffer | null = null;
    let width: number | undefined;
    let height: number | undefined;
    const finalMime = safeMime;
    const finalExt = safeExt;

    if (
      safeMime.startsWith('image/') &&
      safeMime !== 'image/svg+xml' &&
      safeMime !== 'image/gif' // gif animasyonu koru
    ) {
      try {
        const sourceImg = sharp(file.buffer, { failOn: 'none' }).rotate();
        const meta = await sourceImg.metadata();
        width = meta.width;
        height = meta.height;

        // Orijinali max 1920px'e küçült (bant genişliği), metadata strip.
        processedBuffer = await sourceImg
          .clone()
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
          .withMetadata({ orientation: undefined })
          .toBuffer();

        // Thumbnail 300px
        thumbnailBuffer = await sourceImg
          .clone()
          .resize({ width: 300, height: 300, fit: 'inside', withoutEnlargement: true })
          .toBuffer();
      } catch {
        throw new BadRequestException('Geçersiz görsel dosyası');
      }
    }

    // 3) Storage'a temiz buffer'ı yaz — sourcePath yerine buffer geçiyoruz.
    const safeFilename =
      path.basename(file.originalname, path.extname(file.originalname)) +
      finalExt;

    const { url, key } = await this.storage.put({
      tenantId,
      filename: safeFilename,
      mimeType: finalMime,
      size: processedBuffer.length,
      buffer: processedBuffer,
    });

    // Thumbnail'i ayrı bir dosya olarak yükle (aynı klasöre "-thumb" suffix ile).
    let thumbnailUrl: string | null = null;
    if (thumbnailBuffer) {
      const thumbName =
        path.basename(safeFilename, path.extname(safeFilename)) +
        '-thumb' +
        finalExt;
      try {
        const thumb = await this.storage.put({
          tenantId,
          filename: thumbName,
          mimeType: finalMime,
          size: thumbnailBuffer.length,
          buffer: thumbnailBuffer,
        });
        thumbnailUrl = thumb.url;
      } catch {
        // Thumbnail hatası fatal değil.
      }
    }

    const type = this.resolveMediaType(finalMime);

    return this.prisma.media.create({
      data: {
        tenantId,
        type,
        filename: key,
        originalName: file.originalname,
        mimeType: finalMime,
        size: processedBuffer.length,
        url,
        thumbnailUrl,
        width,
        height,
        title: dto.title,
        alt: dto.alt,
        credit: dto.credit,
      },
    });
  }

  private looksLikeSvg(buffer: Buffer): boolean {
    // Basit heuristic — tam bir XML/SVG parse yapmıyoruz ama <script> ve
    // <foreignObject> içeren SVG'yi reddediyoruz (XSS vektörü).
    const head = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
    if (!/<svg[\s>]/i.test(head)) return false;
    if (/<script[\s>]/i.test(head)) return false;
    if (/<foreignObject[\s>]/i.test(head)) return false;
    if (/on\w+\s*=/i.test(head)) return false; // onclick, onload, ...
    return true;
  }

  async update(tenantId: string, id: string, dto: UploadMediaDto) {
    await this.findById(tenantId, id);
    return this.prisma.media.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.alt !== undefined && { alt: dto.alt }),
        ...(dto.credit !== undefined && { credit: dto.credit }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const media = await this.findById(tenantId, id);
    // media.filename now stores the storage backend key (S3 key / cloudinary
    // public_id / local relative path), so hand it to the adapter as-is.
    await this.storage.delete(media.filename);
    return this.prisma.media.delete({ where: { id } });
  }

  private resolveMediaType(mimeType: string): MediaType {
    if (mimeType.startsWith('image/')) return MediaType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaType.VIDEO;
    return MediaType.DOCUMENT;
  }
}
