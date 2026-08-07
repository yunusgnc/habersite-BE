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
exports.PagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let PagesService = class PagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.page.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findPublished(tenantId) {
        return this.prisma.page.findMany({
            where: { tenantId, published: true },
            orderBy: { title: 'asc' },
        });
    }
    async findBySlug(tenantId, slug) {
        const page = await this.prisma.page.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (!page)
            throw new common_1.NotFoundException('Page not found');
        return page;
    }
    async create(tenantId, dto) {
        const baseSlug = dto.slug?.trim() ||
            (0, slugify_1.default)(dto.title, { lower: true, strict: true, locale: 'tr' });
        const slug = await this.ensureUniqueSlug(tenantId, baseSlug);
        const content = this.normalizeContent(dto.content);
        return this.prisma.page.create({
            data: {
                tenantId,
                slug,
                title: dto.title,
                content,
                seoTitle: dto.seoTitle,
                seoDesc: dto.seoDesc,
                published: dto.published ?? true,
            },
        });
    }
    async update(tenantId, id, dto) {
        const data = { ...dto };
        if (dto.content !== undefined) {
            data.content = this.normalizeContent(dto.content);
        }
        if (dto.slug) {
            data.slug = await this.ensureUniqueSlug(tenantId, dto.slug, id);
        }
        return this.prisma.page.update({ where: { id }, data });
    }
    async ensureUniqueSlug(tenantId, baseSlug, ignoreId) {
        let candidate = baseSlug;
        let n = 1;
        while (true) {
            const clash = await this.prisma.page.findFirst({
                where: {
                    tenantId,
                    slug: candidate,
                    ...(ignoreId ? { NOT: { id: ignoreId } } : {}),
                },
                select: { id: true },
            });
            if (!clash)
                return candidate;
            n += 1;
            candidate = `${baseSlug}-${n}`;
        }
    }
    normalizeContent(content) {
        if (typeof content === 'string')
            return { html: content };
        return content ?? {};
    }
    async remove(tenantId, id) {
        return this.prisma.page.delete({ where: { id } });
    }
};
exports.PagesService = PagesService;
exports.PagesService = PagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PagesService);
//# sourceMappingURL=pages.service.js.map