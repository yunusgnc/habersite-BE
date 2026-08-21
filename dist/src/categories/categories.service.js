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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let CategoriesService = class CategoriesService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        const categories = await this.prisma.category.findMany({
            where: { tenantId },
            include: { children: true },
            orderBy: { sortOrder: 'asc' },
        });
        const rootCategories = categories
            .filter((c) => !c.parentId)
            .map((parent) => ({
            ...parent,
            children: categories.filter((c) => c.parentId === parent.id),
        }));
        return rootCategories;
    }
    async findBySlug(tenantId, slug) {
        const category = await this.prisma.category.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
            include: { children: true, parent: true },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async create(tenantId, dto) {
        const slug = await this.generateUniqueSlug(tenantId, dto.name);
        const result = await this.prisma.category.create({
            data: {
                tenantId,
                slug,
                name: dto.name,
                parentId: dto.parentId,
                description: dto.description,
                image: dto.image,
                color: dto.color,
                sortOrder: dto.sortOrder ?? 0,
                seoTitle: dto.seoTitle,
                seoDesc: dto.seoDesc,
            },
            include: { children: true },
        });
        this.revalidation.revalidateTenant(tenantId, ['categories']);
        return result;
    }
    async update(tenantId, id, dto) {
        await this.ensureExists(tenantId, id);
        const data = { ...dto };
        if (dto.name) {
            data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
        }
        const result = await this.prisma.category.update({
            where: { id },
            data,
            include: { children: true },
        });
        this.revalidation.revalidateTenant(tenantId, ['categories']);
        return result;
    }
    async remove(tenantId, id) {
        await this.ensureExists(tenantId, id);
        const result = await this.prisma.category.delete({ where: { id } });
        this.revalidation.revalidateTenant(tenantId, ['categories']);
        return result;
    }
    async reorder(tenantId, items) {
        const updates = items.map((item) => this.prisma.category.updateMany({
            where: { id: item.id, tenantId },
            data: { sortOrder: item.sortOrder },
        }));
        const result = await this.prisma.$transaction(updates);
        this.revalidation.revalidateTenant(tenantId, ['categories']);
        return result;
    }
    async ensureExists(tenantId, id) {
        const category = await this.prisma.category.findFirst({
            where: { id, tenantId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async generateUniqueSlug(tenantId, name, excludeId) {
        let slug = (0, slugify_1.default)(name, { lower: true, strict: true, locale: 'tr' });
        let suffix = 0;
        let candidate = slug;
        while (true) {
            const existing = await this.prisma.category.findUnique({
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
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map