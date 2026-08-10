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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let MenusService = class MenusService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        return this.prisma.menu.findMany({
            where: { tenantId },
            orderBy: { location: 'asc' },
        });
    }
    async findByLocation(tenantId, location) {
        const menu = await this.prisma.menu.findUnique({
            where: { tenantId_location: { tenantId, location } },
        });
        if (!menu)
            return { location, items: [] };
        return menu;
    }
    async upsert(tenantId, dto) {
        const items = dto.items;
        const result = await this.prisma.menu.upsert({
            where: { tenantId_location: { tenantId, location: dto.location } },
            update: { items, label: dto.label ?? null },
            create: { tenantId, location: dto.location, items, label: dto.label ?? null },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
    async update(tenantId, location, dto) {
        const updateData = {};
        if (dto.items !== undefined)
            updateData.items = dto.items;
        if (dto.label !== undefined)
            updateData.label = dto.label || null;
        const result = await this.prisma.menu.upsert({
            where: { tenantId_location: { tenantId, location } },
            update: updateData,
            create: {
                tenantId,
                location,
                items: (dto.items ?? []),
                label: dto.label ?? null,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
    async remove(tenantId, location) {
        const menu = await this.prisma.menu.findUnique({
            where: { tenantId_location: { tenantId, location } },
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found');
        const result = await this.prisma.menu.delete({
            where: { tenantId_location: { tenantId, location } },
        });
        this.revalidation.revalidateTenant(tenantId, ['menus']);
        return result;
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], MenusService);
//# sourceMappingURL=menus.service.js.map