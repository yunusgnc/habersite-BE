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
    async findAll(tenantId, query) {
        const limit = query.limit ?? 30;
        const where = { tenantId };
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
    async findById(tenantId, id) {
        const media = await this.prisma.media.findFirst({
            where: { id, tenantId },
        });
        if (!media) {
            throw new common_1.NotFoundException('Media not found');
        }
        return media;
    }
    async create(tenantId, file, dto) {
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
        const { url, key } = await this.storage.put({
            tenantId,
            filename: safeFilename,
            mimeType: finalMime,
            size: processedBuffer.length,
            buffer: processedBuffer,
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
                });
                thumbnailUrl = thumb.url;
            }
            catch {
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