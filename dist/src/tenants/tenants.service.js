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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const slugify_1 = __importDefault(require("slugify"));
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } });
    }
    async findById(id) {
        const tenant = await this.prisma.tenant.findUnique({ where: { id } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return tenant;
    }
    async findByDomain(domain) {
        return this.prisma.tenant.findFirst({
            where: {
                OR: [{ domain }, { subdomain: domain.split('.')[0] }],
                active: true,
            },
        });
    }
    async create(dto) {
        const slug = (0, slugify_1.default)(dto.name, { lower: true, strict: true, locale: 'tr' });
        return this.prisma.tenant.create({
            data: { ...dto, slug },
        });
    }
    async update(id, dto) {
        await this.findById(id);
        return this.prisma.tenant.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findById(id);
        return this.prisma.tenant.update({
            where: { id },
            data: { active: false },
        });
    }
    async exportAll(id) {
        const tenant = await this.findById(id);
        const [users, articles, categories, tags, authors, media, comments, settings, menus, pages, redirects, auditLogs,] = await Promise.all([
            this.prisma.user.findMany({ where: { tenantId: id } }),
            this.prisma.article.findMany({
                where: { tenantId: id },
                include: {
                    categories: true,
                    tags: true,
                },
            }),
            this.prisma.category.findMany({ where: { tenantId: id } }),
            this.prisma.tag.findMany({ where: { tenantId: id } }),
            this.prisma.author.findMany({ where: { tenantId: id } }),
            this.prisma.media.findMany({ where: { tenantId: id } }),
            this.prisma.comment.findMany({ where: { tenantId: id } }),
            this.prisma.setting.findMany({ where: { tenantId: id } }),
            this.prisma.menu.findMany({ where: { tenantId: id } }),
            this.prisma.page.findMany({ where: { tenantId: id } }),
            this.prisma.redirect.findMany({ where: { tenantId: id } }),
            this.prisma.auditLog.findMany({
                where: { tenantId: id },
                take: 10_000,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        return {
            exportedAt: new Date().toISOString(),
            version: 1,
            tenant,
            users,
            articles,
            categories,
            tags,
            authors,
            media,
            comments,
            settings,
            menus,
            pages,
            redirects,
            auditLogs,
        };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map