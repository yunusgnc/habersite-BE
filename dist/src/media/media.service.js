"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const sayfali_liste_1 = require("../common/pagination/sayfali-liste");
const client_1 = require("@prisma/client");
const storage_module_1 = require("./storage/storage.module");
const file_type_1 = require("file-type");
const sharp_1 = __importDefault(require("sharp"));
const path = __importStar(require("path"));
const ALLOWED_MIMES = new Set([
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
const SVG_MAX_BYTES = 2 * 1024 * 1024;
const num = (v, fallback) => {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? n : fallback;
};
const IMAGE_MAX_DIMENSION = num(process.env.IMAGE_MAX_DIMENSION, 1600);
const IMAGE_QUALITY = num(process.env.IMAGE_QUALITY, 82);
const THUMBNAIL_DIMENSION = num(process.env.THUMBNAIL_DIMENSION, 400);
const THUMBNAIL_QUALITY = num(process.env.THUMBNAIL_QUALITY, 72);
let MediaService = class MediaService {
    prisma;
    storage;
    constructor(prisma, storage) {
        this.prisma = prisma;
        this.storage = storage;
    }
    async resolveMediaBaseUrl(tenantId) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { id: tenantId },
            select: { mediaBaseUrl: true },
        });
        return tenant?.mediaBaseUrl ?? null;
    }
    async findAll(tenantId, query) {
        const limit = query.limit ?? 30;
        const where = { tenantId };
        if (query.type) {
            where.type = query.type;
        }
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
        const sonuc = await (0, sayfali_liste_1.sayfaliListe)({
            limit,
            page: query.page,
            cursor: query.cursor,
            say: () => this.prisma.media.count({ where }),
            bul: (args) => this.prisma.media.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                ...args,
            }),
        });
        const { items, nextCursor, ...kalan } = sonuc;
        return { data: items, nextCursor: nextCursor ?? null, ...kalan };
    }
    async findById(tenantId, id) {
        const media = await this.prisma.media.findFirst({
            where: { id, tenantId },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        return media;
    }
    async dosyayiIsleVeYukle(tenantId, file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('File is required');
        }
        const detected = await (0, file_type_1.fileTypeFromBuffer)(file.buffer);
        let safeMime;
        let safeExt;
        if (detected) {
            if (!ALLOWED_MIMES.has(detected.mime)) {
                throw new common_1.BadRequestException(`İzin verilmeyen dosya tipi: ${detected.mime}`);
            }
            safeMime = detected.mime;
            safeExt = `.${detected.ext}`;
        }
        else if (file.mimetype === 'image/svg+xml' &&
            file.buffer.length <= SVG_MAX_BYTES &&
            this.looksLikeSvg(file.buffer)) {
            safeMime = 'image/svg+xml';
            safeExt = '.svg';
        }
        else {
            throw new common_1.BadRequestException('Dosya tipi tanınamadı veya izin verilmiyor');
        }
        let processedBuffer = file.buffer;
        let thumbnailBuffer = null;
        let width;
        let height;
        let finalMime = safeMime;
        let finalExt = safeExt;
        if (safeMime.startsWith('image/') &&
            safeMime !== 'image/svg+xml' &&
            safeMime !== 'image/gif') {
            try {
                const sourceImg = (0, sharp_1.default)(file.buffer, { failOn: 'none' }).rotate();
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
                const outMeta = await (0, sharp_1.default)(processedBuffer).metadata();
                width = outMeta.width;
                height = outMeta.height;
                finalMime = 'image/webp';
                finalExt = '.webp';
            }
            catch {
                throw new common_1.BadRequestException('Geçersiz görsel dosyası');
            }
        }
        const safeFilename = path.basename(file.originalname, path.extname(file.originalname)) +
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
        let thumbnailUrl = null;
        if (thumbnailBuffer) {
            const thumbName = path.basename(safeFilename, path.extname(safeFilename)) +
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
            }
            catch {
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
    async create(tenantId, file, dto) {
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
    async hamIcerik(tenantId, id) {
        const medya = await this.findById(tenantId, id);
        const yanit = await fetch(medya.url);
        if (!yanit.ok) {
            throw new common_1.NotFoundException('Görsel kaynağa ulaşılamadı');
        }
        return {
            govde: Buffer.from(await yanit.arrayBuffer()),
            mimeType: medya.mimeType,
        };
    }
    async adresiHerYerdeDegistir(tx, tenantId, eski, yeni) {
        if (!eski || eski === yeni)
            return 0;
        const duzSutunlar = [
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
            const kiraciSutunu = tablo === 'tenants' ? 'id' : 'tenant_id';
            etkilenen += await tx.$executeRawUnsafe(`UPDATE "${tablo}" SET "${sutun}" = $1 WHERE "${kiraciSutunu}" = $2 AND "${sutun}" = $3`, yeni, tenantId, eski);
        }
        etkilenen += await tx.$executeRawUnsafe(`UPDATE "gallery_images" gi
          SET "url" = $1
         FROM "galleries" g
        WHERE gi."gallery_id" = g."id"
          AND g."tenant_id" = $2
          AND gi."url" = $3`, yeni, tenantId, eski);
        const jsonSutunlar = [
            ['articles', 'content'],
            ['pages', 'content'],
            ['settings', 'value'],
            ['widgets', 'config'],
        ];
        for (const [tablo, sutun] of jsonSutunlar) {
            etkilenen += await tx.$executeRawUnsafe(`UPDATE "${tablo}"
            SET "${sutun}" = REPLACE("${sutun}"::text, $1, $2)::jsonb
          WHERE "tenant_id" = $3
            AND "${sutun}"::text LIKE '%' || $1 || '%'`, eski, yeni, tenantId);
        }
        return etkilenen;
    }
    async kirpilaniUygula(tenantId, id, file) {
        const mevcut = await this.findById(tenantId, id);
        if (mevcut.type !== client_1.MediaType.IMAGE) {
            throw new common_1.BadRequestException('Yalnızca görseller yeniden kırpılabilir');
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
            const guncellenen = await this.adresiHerYerdeDegistir(tx, tenantId, mevcut.url, yuklenen.url);
            let kucukGuncellenen = 0;
            if (mevcut.thumbnailUrl && yuklenen.thumbnailUrl) {
                kucukGuncellenen = await this.adresiHerYerdeDegistir(tx, tenantId, mevcut.thumbnailUrl, yuklenen.thumbnailUrl);
            }
            return { ...guncel, guncellenenReferans: guncellenen + kucukGuncellenen };
        });
    }
    looksLikeSvg(buffer) {
        const head = buffer.toString('utf8', 0, Math.min(buffer.length, 4096));
        if (!/<svg[\s>]/i.test(head))
            return false;
        if (/<script[\s>]/i.test(head))
            return false;
        if (/<foreignObject[\s>]/i.test(head))
            return false;
        if (/on\w+\s*=/i.test(head))
            return false;
        return true;
    }
    async update(tenantId, id, dto) {
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
    async remove(tenantId, id) {
        const media = await this.findById(tenantId, id);
        await this.storage.delete(media.filename);
        return this.prisma.media.delete({ where: { id } });
    }
    resolveMediaType(mimeType) {
        if (mimeType.startsWith('image/'))
            return client_1.MediaType.IMAGE;
        if (mimeType.startsWith('video/'))
            return client_1.MediaType.VIDEO;
        return client_1.MediaType.DOCUMENT;
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(storage_module_1.STORAGE_ADAPTER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], MediaService);
//# sourceMappingURL=media.service.js.map