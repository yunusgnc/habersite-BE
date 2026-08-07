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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreakingNewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BreakingNewsService = class BreakingNewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActive(tenantId) {
        return this.prisma.breakingNews.findMany({
            where: {
                tenantId,
                active: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findAll(tenantId) {
        return this.prisma.breakingNews.findMany({
            where: { tenantId },
            orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async create(tenantId, dto) {
        let sortOrder = dto.sortOrder;
        if (sortOrder === undefined || sortOrder === null) {
            const last = await this.prisma.breakingNews.findFirst({
                where: { tenantId },
                orderBy: { sortOrder: 'desc' },
                select: { sortOrder: true },
            });
            sortOrder = (last?.sortOrder ?? -1) + 1;
        }
        return this.prisma.breakingNews.create({
            data: {
                tenantId,
                title: dto.title,
                url: dto.url,
                sortOrder,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
        });
    }
    async update(tenantId, id, dto) {
        const item = await this.prisma.breakingNews.findFirst({
            where: { id, tenantId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Breaking news not found');
        }
        return this.prisma.breakingNews.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.expiresAt && { expiresAt: new Date(dto.expiresAt) }),
            },
        });
    }
    async reorder(tenantId, ids) {
        const items = await this.prisma.breakingNews.findMany({
            where: { tenantId, id: { in: ids } },
            select: { id: true },
        });
        const validIds = new Set(items.map((i) => i.id));
        const clean = ids.filter((id) => validIds.has(id));
        await this.prisma.$transaction(clean.map((id, index) => this.prisma.breakingNews.update({
            where: { id },
            data: { sortOrder: index },
        })));
        return { updated: clean.length };
    }
    async remove(tenantId, id) {
        const item = await this.prisma.breakingNews.findFirst({
            where: { id, tenantId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Breaking news not found');
        }
        await this.prisma.breakingNews.delete({ where: { id } });
        return { deleted: true };
    }
};
exports.BreakingNewsService = BreakingNewsService;
exports.BreakingNewsService = BreakingNewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BreakingNewsService);
//# sourceMappingURL=breaking-news.service.js.map