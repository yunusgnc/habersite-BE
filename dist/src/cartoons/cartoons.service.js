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
exports.CartoonsService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
const REVALIDATE_TAGS = ['cartoons'];
const LISTE_ALANLARI = {
    id: true,
    title: true,
    slug: true,
    image: true,
    imageAlt: true,
    artist: true,
    caption: true,
    publishedAt: true,
    viewCount: true,
};
let CartoonsService = class CartoonsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findPublic(tenantId, query = {}) {
        const take = Math.min(Math.max(query.limit ?? 24, 1), 60);
        const where = this.publicWhere(tenantId, query);
        const sayfa = query.page && query.page > 0 ? Math.floor(query.page) : null;
        const [items, total] = await Promise.all([
            this.prisma.cartoon.findMany({
                where,
                take: take + 1,
                ...(sayfa
                    ? { skip: (sayfa - 1) * take }
                    : query.cursor
                        ? { cursor: { id: query.cursor }, skip: 1 }
                        : {}),
                orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
                select: LISTE_ALANLARI,
            }),
            this.prisma.cartoon.count({ where }),
        ]);
        const hasMore = items.length > take;
        const data = hasMore ? items.slice(0, take) : items;
        return {
            data,
            nextCursor: hasMore && !sayfa ? data[data.length - 1].id : null,
            total,
            page: sayfa ?? undefined,
            totalPages: Math.max(1, Math.ceil(total / take)),
            hasMore,
        };
    }
    async findBySlug(tenantId, slug) {
        const cartoon = await this.prisma.cartoon.findFirst({
            where: { tenantId, slug, active: true, publishedAt: { lte: new Date() } },
        });
        if (!cartoon)
            throw new common_1.NotFoundException('Cartoon not found');
        this.prisma.cartoon
            .update({ where: { id: cartoon.id }, data: { viewCount: { increment: 1 } } })
            .catch(() => undefined);
        return cartoon;
    }
    async neighbours(tenantId, slug) {
        const current = await this.prisma.cartoon.findFirst({
            where: { tenantId, slug },
            select: { id: true, publishedAt: true },
        });
        if (!current)
            return { previous: null, next: null };
        const taban = { tenantId, active: true, publishedAt: { lte: new Date() } };
        const secim = { title: true, slug: true, image: true };
        const [previous, next] = await Promise.all([
            this.prisma.cartoon.findFirst({
                where: {
                    ...taban,
                    OR: [
                        { publishedAt: { lt: current.publishedAt } },
                        { publishedAt: current.publishedAt, id: { lt: current.id } },
                    ],
                },
                orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
                select: secim,
            }),
            this.prisma.cartoon.findFirst({
                where: {
                    ...taban,
                    OR: [
                        { publishedAt: { gt: current.publishedAt } },
                        { publishedAt: current.publishedAt, id: { gt: current.id } },
                    ],
                },
                orderBy: [{ publishedAt: 'asc' }, { id: 'asc' }],
                select: secim,
            }),
        ]);
        return { previous, next };
    }
    async artists(tenantId) {
        const rows = await this.prisma.cartoon.groupBy({
            by: ['artist'],
            where: { tenantId, active: true, artist: { not: null } },
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 40,
        });
        return rows
            .filter((r) => r.artist)
            .map((r) => ({ name: r.artist, count: r._count._all }));
    }
    async sitemap(tenantId) {
        return this.prisma.cartoon.findMany({
            where: { tenantId, active: true, publishedAt: { lte: new Date() } },
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            take: 5000,
            select: { slug: true, publishedAt: true, updatedAt: true },
        });
    }
    async findAll(tenantId, opts = {}) {
        const take = Math.min(Math.max(opts.limit ?? 30, 1), 100);
        const where = { tenantId };
        if (opts.search?.trim()) {
            const q = opts.search.trim();
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { artist: { contains: q, mode: 'insensitive' } },
                { caption: { contains: q, mode: 'insensitive' } },
            ];
        }
        const items = await this.prisma.cartoon.findMany({
            where,
            take: take + 1,
            ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
        });
        const hasMore = items.length > take;
        return {
            data: hasMore ? items.slice(0, take) : items,
            nextCursor: hasMore ? items[take - 1].id : null,
        };
    }
    async findOne(tenantId, id) {
        const cartoon = await this.prisma.cartoon.findFirst({ where: { id, tenantId } });
        if (!cartoon)
            throw new common_1.NotFoundException('Cartoon not found');
        return cartoon;
    }
    async stats(tenantId) {
        const now = new Date();
        const [total, active, scheduled] = await Promise.all([
            this.prisma.cartoon.count({ where: { tenantId } }),
            this.prisma.cartoon.count({
                where: { tenantId, active: true, publishedAt: { lte: now } },
            }),
            this.prisma.cartoon.count({
                where: { tenantId, active: true, publishedAt: { gt: now } },
            }),
        ]);
        return { total, active, scheduled };
    }
    async create(tenantId, dto) {
        const slug = await this.uniqueSlug(tenantId, dto.slug || dto.title);
        const created = await this.prisma.cartoon.create({
            data: {
                tenantId,
                title: dto.title.trim(),
                slug,
                image: dto.image.trim(),
                imageAlt: dto.imageAlt?.trim() || null,
                artist: dto.artist?.trim() || null,
                caption: dto.caption?.trim() || null,
                publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
                active: dto.active ?? true,
                seoTitle: dto.seoTitle?.trim() || null,
                seoDesc: dto.seoDesc?.trim() || null,
            },
        });
        this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
        return created;
    }
    async update(tenantId, id, dto) {
        const current = await this.findOne(tenantId, id);
        const slug = dto.slug && dto.slug !== current.slug
            ? await this.uniqueSlug(tenantId, dto.slug, id)
            : undefined;
        const updated = await this.prisma.cartoon.update({
            where: { id },
            data: {
                title: dto.title?.trim(),
                slug,
                image: dto.image?.trim(),
                imageAlt: dto.imageAlt !== undefined ? dto.imageAlt?.trim() || null : undefined,
                artist: dto.artist !== undefined ? dto.artist?.trim() || null : undefined,
                caption: dto.caption !== undefined ? dto.caption?.trim() || null : undefined,
                publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
                active: dto.active,
                seoTitle: dto.seoTitle !== undefined ? dto.seoTitle?.trim() || null : undefined,
                seoDesc: dto.seoDesc !== undefined ? dto.seoDesc?.trim() || null : undefined,
            },
        });
        this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
        return updated;
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        await this.prisma.cartoon.delete({ where: { id } });
        this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
        return { deleted: true };
    }
    publicWhere(tenantId, query) {
        const where = {
            tenantId,
            active: true,
            publishedAt: { lte: new Date() },
        };
        if (query.artist?.trim()) {
            where.artist = { equals: query.artist.trim(), mode: 'insensitive' };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { caption: { contains: q, mode: 'insensitive' } },
                { artist: { contains: q, mode: 'insensitive' } },
            ];
        }
        return where;
    }
    async uniqueSlug(tenantId, source, ignoreId) {
        const base = (0, slugify_1.default)(source, { lower: true, strict: true, locale: 'tr' }) || 'karikatur';
        const clash = await this.prisma.cartoon.findFirst({
            where: { tenantId, slug: base, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
            select: { id: true },
        });
        return clash ? `${base}-${Date.now().toString(36)}` : base;
    }
};
exports.CartoonsService = CartoonsService;
exports.CartoonsService = CartoonsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        revalidation_service_1.RevalidationService])
], CartoonsService);
//# sourceMappingURL=cartoons.service.js.map