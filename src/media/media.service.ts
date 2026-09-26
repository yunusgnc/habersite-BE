import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { sayfaliListe } from '../common/pagination/sayfali-liste';
import { MediaType, Prisma } from '@prisma/client';
import { UploadMediaDto } from './dto/upload-media.dto';
import { QueryMediaDto } from './dto/query-media.dto';
import { STORAGE_ADAPTER } from './storage/storage.module';
import type { StorageAdapter } from './storage/storage.types';
import { fileTypeFromBuffer } from 'file-type';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';

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

/**
 * Görsel işleme ayarları. Haber sitesinde manşet görseli ekranda en fazla
 * ~1200px genişlikte gösteriliyor; 1600px retina için fazlasıyla yeterli.
 * Kalite 82 gözle ayırt edilemeyen ama dosyayı belirgin küçülten eşik.
 * Gerekirse env ile ayarlanabilir.
 */
const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
const IMAGE_MAX_DIMENSION = num(process.env.IMAGE_MAX_DIMENSION, 1600);
const IMAGE_QUALITY = num(process.env.IMAGE_QUALITY, 82);
const THUMBNAIL_DIMENSION = num(process.env.THUMBNAIL_DIMENSION, 400);
const THUMBNAIL_QUALITY = num(process.env.THUMBNAIL_QUALITY, 72);

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(STORAGE_ADAPTER) private readonly storage: StorageAdapter,
  ) {}

  /**
   * Müşterinin kendi CDN domaini (ör. cdn.kayseritimes.com). Tek R2 bucket'ına
   * birden çok özel domain bağlanabildiği için dosya taşınmaz, yalnızca
   * üretilen adres değişir. Tanımsızsa S3_PUBLIC_URL'e düşer.
   * Yükleme başına tek sorgu; sıcak yolda değil.
   */
  private async resolveMediaBaseUrl(tenantId: string): Promise<string | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { mediaBaseUrl: true },
    });
    return tenant?.mediaBaseUrl ?? null;
  }

  async findAll(tenantId: string, query: QueryMediaDto) {
    const limit = query.limit ?? 30;

    const where: Record<string, any> = { tenantId };
    if (query.type) {
      where.type = query.type;
    }
    // Arama sunucu tarafında yapılmalı: panel yalnızca 30'luk sayfalar
    // yüklüyor, istemcide filtrelemek 41 bin dosyalık bir arşivde yüklenmemiş
    // kayıtları hiç göremiyordu.
    const q = query.search?.trim();
    if (q) {
      where.OR = [
        { originalName: { contains: q, mode: 'insensitive' } },
        { filename: { contains: q, mode: 'insensitive' } },
        { title: { contains: q, mode: 'insensitive' } },
        { alt: { contains: q, mode: 'insensitive' } },
        { url: { contains: q, mode: 'insensitive' } },
      ];
    }

    const sonuc = await sayfaliListe({
      limit,
      page: query.page,
      cursor: query.cursor,
      say: () => this.prisma.media.count({ where }),
      bul: (args) =>
        this.prisma.media.findMany({
          where,
          // `createdAt` tek başına unique degil — ozellikle migration ile gelen
          // kayitlarda binlerce satir ayni damgayi tasiyor. Deterministik
          // siralama sart, yoksa sayfa sinirlarinda satirlar hem tekrarliyor
          // (React "duplicate key") hem de tamamen atlaniyor.
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          ...args,
        }),
    });

    // Tarihî sözleşme: bu ucun kayıt anahtarı `data` — panel ve medya seçici
    // öyle okuyor. Yardımcının `items`ı burada ada çevrilir.
    const { items, nextCursor, ...kalan } = sonuc;
    return { data: items, nextCursor: nextCursor ?? null, ...kalan };
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

  /**
   * Yükleme hattı: doğrulama, sharp ile yeniden kodlama, küçük görsel üretimi
   * ve depoya yazma.
   *
   * `create` ile yeniden kırpma aynı hattı kullanır. Kırpılan dosya ilk
   * yüklemeyle birebir aynı işlemlerden geçmeli (EXIF temizliği, WebP'ye
   * çevirme, boyut sınırı); iki yerde ayrı yazılsaydı biri güncellenip
   * diğeri unutulurdu.
   */
  private async dosyayiIsleVeYukle(
    tenantId: string,
    file: Express.Multer.File,
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
    let finalMime = safeMime;
    let finalExt = safeExt;

    if (
      safeMime.startsWith('image/') &&
      safeMime !== 'image/svg+xml' &&
      safeMime !== 'image/gif' // gif animasyonu koru
    ) {
      try {
        const sourceImg = sharp(file.buffer, { failOn: 'none' }).rotate();

        // Çıktı formatı WebP'ye sabitlenir. Aksi halde sharp girdi formatını
        // korur ve PNG yüklenen bir fotoğraf KAYIPSIZ kalır — ölçtüğümüzde
        // 1920px'e küçültülmüş bir PNG 7 MB, aynı görsel WebP olarak 1,4 MB.
        // WebP saydamlığı da desteklediği için PNG logolar bozulmaz.
        processedBuffer = await sourceImg
          .clone()
          .resize({
            width: IMAGE_MAX_DIMENSION,
            height: IMAGE_MAX_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: IMAGE_QUALITY })
          .toBuffer();

        thumbnailBuffer = await sourceImg
          .clone()
          .resize({
            width: THUMBNAIL_DIMENSION,
            height: THUMBNAIL_DIMENSION,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: THUMBNAIL_QUALITY })
          .toBuffer();

        // Boyutlar KÜÇÜLTÜLMÜŞ dosyadan okunur. Orijinalin ölçüsü yazılırsa
        // DB'deki en-boy gerçek dosyayla uyuşmaz ve <img width/height> ile
        // yer ayıran arayüzlerde kayma (CLS) olur.
        const outMeta = await sharp(processedBuffer).metadata();
        width = outMeta.width;
        height = outMeta.height;

        finalMime = 'image/webp';
        finalExt = '.webp';
      } catch {
        throw new BadRequestException('Geçersiz görsel dosyası');
      }
    }

    // 3) Storage'a temiz buffer'ı yaz — sourcePath yerine buffer geçiyoruz.
    const safeFilename =
      path.basename(file.originalname, path.extname(file.originalname)) +
      finalExt;

    const publicBaseUrl = await this.resolveMediaBaseUrl(tenantId);

    const { url, key } = await this.storage.put({
      tenantId,
      filename: safeFilename,
      mimeType: finalMime,
      size: processedBuffer.length,
      buffer: processedBuffer,
      publicBaseUrl,
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
          publicBaseUrl,
        });
        thumbnailUrl = thumb.url;
      } catch {
        // Thumbnail hatası fatal değil.
      }
    }

    return {
      key,
      url,
      thumbnailUrl,
      width,
      height,
      mimeType: finalMime,
      size: processedBuffer.length,
      type: this.resolveMediaType(finalMime),
    };
  }

  async create(
    tenantId: string,
    file: Express.Multer.File,
    dto: UploadMediaDto,
  ) {
    const yuklenen = await this.dosyayiIsleVeYukle(tenantId, file);

    return this.prisma.media.create({
      data: {
        tenantId,
        type: yuklenen.type,
        filename: yuklenen.key,
        originalName: file.originalname,
        mimeType: yuklenen.mimeType,
        size: yuklenen.size,
        url: yuklenen.url,
        thumbnailUrl: yuklenen.thumbnailUrl,
        width: yuklenen.width,
        height: yuklenen.height,
        title: dto.title,
        alt: dto.alt,
        credit: dto.credit,
      },
    });
  }

  /**
   * Görselin ham baytları — panelin yeniden kırpma ekranı için.
   *
   * Neden aracıya ihtiyaç var: dosyalar müşterinin CDN'inde (ayrı origin) ve
   * o adres CORS başlığı göndermiyor. Tarayıcı böyle bir görseli tuvale
   * çizdiğinde tuval "kirleniyor" ve kırpılan çıktı alınamıyor. Baytları
   * kendi API'mizden geçirince panel bunu blob'a alıp aynı origin gibi
   * kullanıyor; kırpma sorunsuz çalışıyor.
   */
  /**
   * Kırpma editörünün okuduğu ham dosya.
   *
   * Adres GÖRELİ olabiliyor: yerel disk depolamasında kayıt
   * `/uploads/<kiracı>/...` biçiminde duruyor ve `fetch` bunu
   * `ERR_INVALID_URL` ile reddediyor. Uç bu yüzden yerel diskte hiç
   * çalışmıyordu — kırpma yalnızca R2/Cloudinary kullanan kurulumlarda
   * açılıyor, yerelde "Görsel açılamadı" diyordu. Göreli adreste dosya
   * depolama anahtarından (`filename`) diskten okunuyor.
   */
  async hamIcerik(tenantId: string, id: string) {
    const medya = await this.findById(tenantId, id);
    const mutlak = /^https?:\/\//i.test(medya.url);

    if (!mutlak) {
      const yol = path.join(process.cwd(), medya.filename);
      try {
        return {
          govde: await fs.readFile(yol),
          mimeType: medya.mimeType,
        };
      } catch {
        throw new NotFoundException('Görsel kaynağa ulaşılamadı');
      }
    }

    const yanit = await fetch(medya.url);
    if (!yanit.ok) {
      throw new NotFoundException('Görsel kaynağa ulaşılamadı');
    }

    return {
      govde: Buffer.from(await yanit.arrayBuffer()),
      mimeType: medya.mimeType,
    };
  }

  /**
   * Bir görselin adresini geçen tüm kayıtlarda yenisiyle değiştirir.
   *
   * Haberler görseli Media kaydına referansla değil, ADRES METNİ olarak
   * saklıyor (`featured_image`, gövde HTML'i, reklam afişi...). Dolayısıyla
   * Media satırını güncellemek tek başına yetmez; eski adres nerede geçiyorsa
   * orada da değişmeli, yoksa haber eski kadrajı göstermeye devam eder.
   *
   * `article_revisions` bilinçli olarak DIŞARIDA: o tablo geçmişin kaydı,
   * geriye dönük değiştirilmesi doğru olmaz. Eski dosya depodan silinmediği
   * için o kayıtlar çalışmaya devam eder.
   */
  private async adresiHerYerdeDegistir(
    tx: Prisma.TransactionClient,
    tenantId: string,
    eski: string,
    yeni: string,
  ): Promise<number> {
    if (!eski || eski === yeni) return 0;

    // Düz metin sütunları: tam eşleşme yeterli, adres bütün olarak saklanıyor.
    const duzSutunlar: [string, string][] = [
      ['tenants', 'logo'],
      ['tenants', 'favicon'],
      ['users', 'avatar'],
      ['categories', 'image'],
      ['authors', 'avatar'],
      ['articles', 'featured_image'],
      ['articles', 'og_image'],
      ['articles', 'headline_image'],
      ['ads', 'image_url'],
      ['person_profiles', 'image'],
      ['popups', 'image_url'],
      ['galleries', 'cover_image'],
      ['videos', 'cover_image'],
    ];

    let etkilenen = 0;

    for (const [tablo, sutun] of duzSutunlar) {
      // tenants'ın kendi anahtarı "id"; diğerlerinde "tenant_id".
      const kiraciSutunu = tablo === 'tenants' ? 'id' : 'tenant_id';
      etkilenen += await tx.$executeRawUnsafe(
        `UPDATE "${tablo}" SET "${sutun}" = $1 WHERE "${kiraciSutunu}" = $2 AND "${sutun}" = $3`,
        yeni,
        tenantId,
        eski,
      );
    }

    // Galeri görselleri kiracıyı doğrudan taşımıyor, bağlı olduğu galeriden
    // alıyor; bu yüzden ayrı ve JOIN'li.
    etkilenen += await tx.$executeRawUnsafe(
      `UPDATE "gallery_images" gi
          SET "url" = $1
         FROM "galleries" g
        WHERE gi."gallery_id" = g."id"
          AND g."tenant_id" = $2
          AND gi."url" = $3`,
      yeni,
      tenantId,
      eski,
    );

    // JSON sütunları: adres gövde HTML'inin ya da yerleşim ayarının içinde
    // gömülü geçiyor, tam eşleşme işe yaramaz. Metne çevirip değiştiriyoruz.
    const jsonSutunlar: [string, string][] = [
      ['articles', 'content'],
      ['pages', 'content'],
      ['settings', 'value'],
      ['widgets', 'config'],
    ];

    for (const [tablo, sutun] of jsonSutunlar) {
      etkilenen += await tx.$executeRawUnsafe(
        `UPDATE "${tablo}"
            SET "${sutun}" = REPLACE("${sutun}"::text, $1, $2)::jsonb
          WHERE "tenant_id" = $3
            AND "${sutun}"::text LIKE '%' || $1 || '%'`,
        eski,
        yeni,
        tenantId,
      );
    }

    return etkilenen;
  }

  /**
   * Yüklenmiş bir görseli yeniden kırpılmış haliyle değiştirir.
   *
   * Dosya YENİ bir anahtara yazılır, eskisinin üzerine yazılmaz: depodaki
   * nesneler bir yıllık `immutable` önbellek başlığıyla sunuluyor, aynı
   * adrese yazmak tarayıcılarda ve CDN'de eski görüntünün asılı kalması
   * demekti. Yeni adres kullanılınca değişiklik anında görünür.
   *
   * Eski dosya depodan SİLİNMİYOR. Dışarıdan verilmiş bağlantılar, arama
   * motoru önbellekleri ve haber geçmişi ona işaret ediyor olabilir; R2'de
   * saklama ucuz, kırık görsel pahalı.
   */
  async kirpilaniUygula(
    tenantId: string,
    id: string,
    file: Express.Multer.File,
  ) {
    const mevcut = await this.findById(tenantId, id);

    if (mevcut.type !== MediaType.IMAGE) {
      throw new BadRequestException('Yalnızca görseller yeniden kırpılabilir');
    }

    const yuklenen = await this.dosyayiIsleVeYukle(tenantId, file);

    return this.prisma.$transaction(async (tx) => {
      const guncel = await tx.media.update({
        where: { id },
        data: {
          filename: yuklenen.key,
          mimeType: yuklenen.mimeType,
          size: yuklenen.size,
          url: yuklenen.url,
          thumbnailUrl: yuklenen.thumbnailUrl,
          width: yuklenen.width,
          height: yuklenen.height,
        },
      });

      const guncellenen = await this.adresiHerYerdeDegistir(
        tx,
        tenantId,
        mevcut.url,
        yuklenen.url,
      );

      // Küçük görselin adresi de gövdelerde geçebiliyor (eski editör
      // sürümleri thumbnail gömüyordu); o da güncellensin.
      let kucukGuncellenen = 0;
      if (mevcut.thumbnailUrl && yuklenen.thumbnailUrl) {
        kucukGuncellenen = await this.adresiHerYerdeDegistir(
          tx,
          tenantId,
          mevcut.thumbnailUrl,
          yuklenen.thumbnailUrl,
        );
      }

      return { ...guncel, guncellenenReferans: guncellenen + kucukGuncellenen };
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
