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
exports.GalleriesService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let GalleriesService = class GalleriesService {
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
        const items = await this.prisma.gallery.findMany({
            where,
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            take: limit + 1,
            ...(cursor && {
                cursor: { id: cursor },
                skip: 1,
            }),
            include: {
                _count: { select: { images: true } },
            },
        });
        const hasMore = items.length > limit;
        if (hasMore)
            items.pop();
        const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
        return { items, nextCursor };
    }
    async findOne(tenantId, id) {
        const gallery = await this.prisma.gallery.findFirst({
            where: { id, tenantId },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found');
        }
        return gallery;
    }
    async findBySlug(tenantId, slug) {
        const gallery = await this.prisma.gallery.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        if (!gallery) {
            throw new common_1.NotFoundException('Gallery not found');
        }
        return gallery;
    }
    async create(tenantId, dto) {
        const { images, publishedAt: publishedAtStr, slug: slugInput, ...data } = dto;
        const slug = await this.generateUniqueSlug(tenantId, slugInput?.trim() || data.title);
        const publishedAt = data.status === client_1.ArticleStatus.PUBLISHED && !publishedAtStr
            ? new Date()
            : publishedAtStr
                ? new Date(publishedAtStr)
                : undefined;
        const gallery = await this.prisma.gallery.create({
            data: {
                ...data,
                tenantId,
                slug,
                publishedAt,
                images: images?.length
                    ? {
                        create: images.map((img, index) => ({
                            url: img.url,
                            caption: img.caption,
                            credit: img.credit,
                            alt: img.alt,
                            sortOrder: img.sortOrder ?? index,
                        })),
                    }
                    : undefined,
            },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
        return gallery;
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
        return this.prisma.gallery.update({
            where: { id },
            data: updateData,
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
            },
        });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.gallery.update({
            where: { id },
            data: { status: client_1.ArticleStatus.ARCHIVED },
        });
    }
    async addImages(tenantId, galleryId, images) {
        await this.findOne(tenantId, galleryId);
        const lastImage = await this.prisma.galleryImage.findFirst({
            where: { galleryId },
            orderBy: { sortOrder: 'desc' },
        });
        const startOrder = (lastImage?.sortOrder ?? -1) + 1;
        return this.prisma.galleryImage.createMany({
            data: images.map((img, index) => ({
                galleryId,
                url: img.url,
                caption: img.caption,
                credit: img.credit,
                alt: img.alt,
                sortOrder: img.sortOrder ?? startOrder + index,
            })),
        });
    }
    async removeImage(tenantId, imageId) {
        const image = await this.prisma.galleryImage.findUnique({
            where: { id: imageId },
            include: { gallery: { select: { tenantId: true } } },
        });
        if (!image || image.gallery.tenantId !== tenantId) {
            throw new common_1.NotFoundException('Gallery image not found');
        }
        return this.prisma.galleryImage.delete({
            where: { id: imageId },
        });
    }
    async reorderImages(tenantId, galleryId, imageIds) {
        await this.findOne(tenantId, galleryId);
        const updates = imageIds.map((id, index) => this.prisma.galleryImage.update({
            where: { id },
            data: { sortOrder: index },
        }));
        return this.prisma.$transaction(updates);
    }
    async generateUniqueSlug(tenantId, title) {
        let slug = (0, slugify_1.default)(title, { lower: true, strict: true, locale: 'tr' });
        const existing = await this.prisma.gallery.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }
        return slug;
    }
};
exports.GalleriesService = GalleriesService;
exports.GalleriesService = GalleriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], GalleriesService);
//# sourceMappingURL=galleries.service.js.map