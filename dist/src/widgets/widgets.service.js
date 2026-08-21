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
exports.WidgetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let WidgetsService = class WidgetsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        return this.prisma.widget.findMany({
            where: { tenantId },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findActive(tenantId) {
        return this.prisma.widget.findMany({
            where: { tenantId, active: true },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findByType(tenantId, type) {
        return this.prisma.widget.findUnique({
            where: { tenantId_type: { tenantId, type } },
        });
    }
    async upsert(tenantId, type, data) {
        const result = await this.prisma.widget.upsert({
            where: { tenantId_type: { tenantId, type } },
            create: { tenantId, type, ...data },
            update: data,
        });
        this.revalidation.revalidateTenant(tenantId, ['widgets', 'homepage-layout']);
        return result;
    }
    async updateCache(tenantId, type, cache) {
        const result = await this.prisma.widget.update({
            where: { tenantId_type: { tenantId, type } },
            data: { cache, cachedAt: new Date() },
        });
        this.revalidation.revalidateTenant(tenantId, ['widgets']);
        return result;
    }
    async remove(tenantId, type) {
        const result = await this.prisma.widget.delete({
            where: { tenantId_type: { tenantId, type } },
        });
        this.revalidation.revalidateTenant(tenantId, ['widgets', 'homepage-layout']);
        return result;
    }
};
exports.WidgetsService = WidgetsService;
exports.WidgetsService = WidgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], WidgetsService);
//# sourceMappingURL=widgets.service.js.map