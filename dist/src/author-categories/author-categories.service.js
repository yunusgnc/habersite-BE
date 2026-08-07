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
exports.AuthorCategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let AuthorCategoriesService = class AuthorCategoriesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.authorCategory.findMany({
            where: { tenantId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findOne(tenantId, id) {
        const authorCategory = await this.prisma.authorCategory.findFirst({
            where: { id, tenantId },
        });
        if (!authorCategory) {
            throw new common_1.NotFoundException('Author category not found');
        }
        return authorCategory;
    }
    async create(tenantId, dto) {
        const slug = await this.generateUniqueSlug(tenantId, dto.name);
        return this.prisma.authorCategory.create({
            data: {
                tenantId,
                name: dto.name,
                slug,
                sortOrder: dto.sortOrder ?? 0,
                active: dto.active ?? true,
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.ensureExists(tenantId, id);
        const data = { ...dto };
        if (dto.name) {
            data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
        }
        return this.prisma.authorCategory.update({
            where: { id },
            data,
        });
    }
    async remove(tenantId, id) {
        await this.ensureExists(tenantId, id);
        return this.prisma.authorCategory.delete({
            where: { id },
        });
    }
    async reorder(tenantId, items) {
        return this.prisma.$transaction(items.map((item) => this.prisma.authorCategory.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
        })));
    }
    async ensureExists(tenantId, id) {
        const authorCategory = await this.prisma.authorCategory.findFirst({
            where: { id, tenantId },
        });
        if (!authorCategory) {
            throw new common_1.NotFoundException('Author category not found');
        }
        return authorCategory;
    }
    async generateUniqueSlug(tenantId, name, excludeId) {
        let slug = (0, slugify_1.default)(name, { lower: true, strict: true, locale: 'tr' });
        let suffix = 0;
        let candidate = slug;
        while (true) {
            const existing = await this.prisma.authorCategory.findUnique({
                where: { tenantId_slug: { tenantId, slug: candidate } },
            });
            if (!existing || existing.id === excludeId)
                return candidate;
            suffix++;
            candidate = `${slug}-${suffix}`;
        }
    }
};
exports.AuthorCategoriesService = AuthorCategoriesService;
exports.AuthorCategoriesService = AuthorCategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthorCategoriesService);
//# sourceMappingURL=author-categories.service.js.map