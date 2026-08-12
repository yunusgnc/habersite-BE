"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideosService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let VideosService = class VideosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId, query) {
        const { cursor, limit = 20, status, search } = query;
        const where = { tenantId };
        if (status)
            where.status = status;
        if (search)
            where.title = { contains: search, mode: 'insensitive' };
        const items = await this.prisma.video.findMany({
            where,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
        });
        let nextCursor;
        if (items.length > limit) {
            const next = items.pop();
            nextCursor = next.id;
        }
        return { items, nextCursor };
    }
    async findOne(tenantId, id) {
        const video = await this.prisma.video.findFirst({
            where: { id, tenantId },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return video;
    }
    async findBySlug(tenantId, slug) {
        const video = await this.prisma.video.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (!video) {
            throw new common_1.NotFoundException('Video not found');
        }
        return video;
    }
    async create(tenantId, dto) {
        const { publishedAt: publishedAtStr, slug: slugInput, ...data } = dto;
        if (!data.videoUrl && !data.embedCode) {
            throw new common_1.BadRequestException('Video kaynağı gerekli: bir video yükleyin veya embed kodu ekleyin.');
        }
        const videoUrl = data.videoUrl || 'embed:custom';
        const slug = await this.generateUniqueSlug(tenantId, slugInput?.trim() || data.title);
        const publishedAt = data.status === client_1.ArticleStatus.PUBLISHED && !publishedAtStr
            ? new Date()
            : publishedAtStr
                ? new Date(publishedAtStr)
                : undefined;
        return this.prisma.video.create({
            data: {
                ...data,
                videoUrl,
                tenantId,
                slug,
                publishedAt,
                source: data.source ?? (data.embedCode ? 'embed' : 'upload'),
            },
        });
    }
    async update(tenantId, id, dto) {
        const existing = await this.findOne(tenantId, id);
        const { publishedAt: publishedAtStr, ...rest } = dto;
        const updateData = { ...rest };
        const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined;
        if (rest.status === client_1.ArticleStatus.PUBLISHED &&
            existing.status !== client_1.ArticleStatus.PUBLISHED &&
            !publishedAt &&
            !existing.publishedAt) {
            updateData.publishedAt = new Date();
        }
        else if (publishedAt) {
            updateData.publishedAt = publishedAt;
        }
        return this.prisma.video.update({
            where: { id },
            data: updateData,
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.video.update({
            where: { id },
            data: { status: client_1.ArticleStatus.ARCHIVED },
        });
    }
    async generateUniqueSlug(tenantId, title) {
        let slug = (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'tr' });
        const existing = await this.prisma.video.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }
        return slug;
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VideosService);
//# sourceMappingURL=videos.service.js.map