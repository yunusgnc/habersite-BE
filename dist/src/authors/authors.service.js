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
exports.AuthorsService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let AuthorsService = class AuthorsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        return this.prisma.author.findMany({
            where: { tenantId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findWithLatest(tenantId, limit = 12) {
        const authors = await this.prisma.author.findMany({
            where: { tenantId, active: true },
            orderBy: { sortOrder: 'asc' },
            select: { id: true, name: true, slug: true, avatar: true, bio: true },
        });
        if (authors.length === 0)
            return [];
        const withLatest = await Promise.all(authors.map(async (author) => {
            const latest = await this.prisma.article.findFirst({
                where: {
                    tenantId,
                    authorId: author.id,
                    status: 'PUBLISHED',
                    publishedAt: { lte: new Date() },
                },
                orderBy: { publishedAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    slug: true,
                    spot: true,
                    featuredImage: true,
                    publishedAt: true,
                },
            });
            return { ...author, latestArticle: latest };
        }));
        return withLatest
            .filter((a) => a.latestArticle !== null)
            .sort((a, b) => {
            const at = a.latestArticle?.publishedAt?.getTime() ?? 0;
            const bt = b.latestArticle?.publishedAt?.getTime() ?? 0;
            return bt - at;
        })
            .slice(0, Math.min(limit, 40));
    }
    async findBySlug(tenantId, slug) {
        const author = await this.prisma.author.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (!author) {
            throw new common_1.NotFoundException('Author not found');
        }
        return author;
    }
    async create(tenantId, dto) {
        const slug = await this.generateUniqueSlug(tenantId, dto.name);
        const result = await this.prisma.author.create({
            data: {
                tenantId,
                slug,
                name: dto.name,
                bio: dto.bio,
                avatar: dto.avatar,
                email: dto.email,
                social: dto.social ?? {},
                active: dto.active ?? true,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['authors']);
        return result;
    }
    async update(tenantId, id, dto) {
        await this.ensureExists(tenantId, id);
        const data = { ...dto };
        if (dto.name) {
            data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
        }
        const result = await this.prisma.author.update({
            where: { id },
            data,
        });
        this.revalidation.revalidateTenant(tenantId, ['authors']);
        return result;
    }
    async remove(tenantId, id) {
        await this.ensureExists(tenantId, id);
        const result = await this.prisma.author.delete({ where: { id } });
        this.revalidation.revalidateTenant(tenantId, ['authors']);
        return result;
    }
    async ensureExists(tenantId, id) {
        const author = await this.prisma.author.findFirst({
            where: { id, tenantId },
        });
        if (!author) {
            throw new common_1.NotFoundException('Author not found');
        }
        return author;
    }
    async generateUniqueSlug(tenantId, name, excludeId) {
        let slug = (0, slugify_1.default)(name, { lower: true, strict: true, locale: 'tr' });
        let suffix = 0;
        let candidate = slug;
        while (true) {
            const existing = await this.prisma.author.findUnique({
                where: { tenantId_slug: { tenantId, slug: candidate } },
            });
            if (!existing || existing.id === excludeId) {
                return candidate;
            }
            suffix++;
            candidate = `${slug}-${suffix}`;
        }
    }
};
exports.AuthorsService = AuthorsService;
exports.AuthorsService = AuthorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], AuthorsService);
//# sourceMappingURL=authors.service.js.map