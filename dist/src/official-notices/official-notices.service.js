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
exports.OfficialNoticesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
const REVALIDATE_TAGS = ['official-notices'];
let OfficialNoticesService = class OfficialNoticesService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findPublic(tenantId, query = {}) {
        const take = Math.min(query.limit ?? 20, 60);
        const now = new Date();
        const where = {
            tenantId,
            active: true,
            publishedAt: { lte: now },
            ...(query.archived
                ? { expiresAt: { not: null, lt: now } }
                : { OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] }),
        };
        if (query.noticeType)
            where.noticeType = query.noticeType;
        if (query.institution?.trim()) {
            where.institution = { contains: query.institution.trim(), mode: 'insensitive' };
        }
        if (query.search?.trim()) {
            const q = query.search.trim();
            where.AND = [
                {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { summary: { contains: q, mode: 'insensitive' } },
                        { institution: { contains: q, mode: 'insensitive' } },
                        { referenceNo: { contains: q, mode: 'insensitive' } },
                    ],
                },
            ];
        }
        const items = await this.prisma.officialNotice.findMany({
            where,
            take: take + 1,
            ...(query.cursor ? { cursor: { id: query.cursor }, skip: 1 } : {}),
            orderBy: [{ publishedAt: 'desc' }, { id: 'desc' }],
            select: {
                id: true,
                title: true,
                slug: true,
                noticeType: true,
                institution: true,
                referenceNo: true,
                summary: true,
                attachments: true,
                publishedAt: true,
                expiresAt: true,
                viewCount: true,
            },
        });
        const hasMore = items.length > take;
        return {
            data: hasMore ? items.slice(0, take) : items,
            nextCursor: hasMore ? items[take - 1].id : null,
        };
    }
    async findBySlug(tenantId, slug) {
        const notice = await this.prisma.officialNotice.findFirst({
            where: { tenantId, slug, active: true, publishedAt: { lte: new Date() } },
        });
        if (!notice)
            throw new common_1.NotFoundException('Official notice not found');
        this.prisma.officialNotice
            .update({ where: { id: notice.id }, data: { viewCount: { increment: 1 } } })
            .catch(() => undefined);
        return notice;
    }
    async institutions(tenantId) {
        const rows = await this.prisma.officialNotice.groupBy({
            by: ['institution'],
            where: { tenantId, active: true },
            _count: { _all: true },
            orderBy: { _count: { id: 'desc' } },
            take: 40,
        });
        return rows.map((r) => ({ name: r.institution, count: r._count._all }));
    }
    async findAll(tenantId, opts = {}) {
        const take = Math.min(opts.limit ?? 30, 100);
        const where = { tenantId };
        if (opts.noticeType)
            where.noticeType = opts.noticeType;
        if (opts.search?.trim()) {
            const q = opts.search.trim();
            where.OR = [
                { title: { contains: q, mode: 'insensitive' } },
                { institution: { contains: q, mode: 'insensitive' } },
                { referenceNo: { contains: q, mode: 'insensitive' } },
            ];
        }
        const items = await this.prisma.officialNotice.findMany({
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
        const notice = await this.prisma.officialNotice.findFirst({ where: { id, tenantId } });
        if (!notice)
            throw new common_1.NotFoundException('Official notice not found');
        return notice;
    }
    async stats(tenantId) {
        const now = new Date();
        const [total, active, expired] = await Promise.all([
            this.prisma.officialNotice.count({ where: { tenantId } }),
            this.prisma.officialNotice.count({
                where: {
                    tenantId,
                    active: true,
                    OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
                },
            }),
            this.prisma.officialNotice.count({
                where: { tenantId, expiresAt: { not: null, lt: now } },
            }),
        ]);
        return { total, active, expired };
    }
    async create(tenantId, dto) {
        const slug = await this.uniqueSlug(tenantId, dto.slug || dto.title);
        const created = await this.prisma.officialNotice.create({
            data: {
                tenantId,
                title: dto.title.trim(),
                slug,
                noticeType: dto.noticeType ?? client_1.NoticeType.TENDER,
                institution: dto.institution.trim(),
                referenceNo: dto.referenceNo?.trim() || null,
                summary: dto.summary?.trim() || null,
                content: dto.content,
                attachments: (dto.attachments ?? []),
                publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
                active: dto.active ?? true,
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
        const updated = await this.prisma.officialNotice.update({
            where: { id },
            data: {
                title: dto.title?.trim(),
                slug,
                noticeType: dto.noticeType,
                institution: dto.institution?.trim(),
                referenceNo: dto.referenceNo !== undefined ? dto.referenceNo?.trim() || null : undefined,
                summary: dto.summary !== undefined ? dto.summary?.trim() || null : undefined,
                content: dto.content,
                attachments: dto.attachments !== undefined
                    ? dto.attachments
                    : undefined,
                publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
                expiresAt: dto.expiresAt !== undefined
                    ? dto.expiresAt
                        ? new Date(dto.expiresAt)
                        : null
                    : undefined,
                active: dto.active,
            },
        });
        this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
        return updated;
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        await this.prisma.officialNotice.delete({ where: { id } });
        this.revalidation.revalidateTenant(tenantId, REVALIDATE_TAGS);
        return { deleted: true };
    }
    async uniqueSlug(tenantId, source, ignoreId) {
        const base = (0, slugify_1.default)(source, { lower: true, strict: true, locale: 'tr' }) || 'resmi-ilan';
        const clash = await this.prisma.officialNotice.findFirst({
            where: { tenantId, slug: base, ...(ignoreId ? { id: { not: ignoreId } } : {}) },
            select: { id: true },
        });
        return clash ? `${base}-${Date.now().toString(36)}` : base;
    }
};
exports.OfficialNoticesService = OfficialNoticesService;
exports.OfficialNoticesService = OfficialNoticesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        revalidation_service_1.RevalidationService])
], OfficialNoticesService);
//# sourceMappingURL=official-notices.service.js.map