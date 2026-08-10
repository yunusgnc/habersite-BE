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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let SettingsService = class SettingsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async getAll(tenantId) {
        const settings = await this.prisma.setting.findMany({
            where: { tenantId },
        });
        return settings.reduce((acc, setting) => {
            acc[setting.key] = setting.value;
            return acc;
        }, {});
    }
    async get(tenantId, key) {
        const setting = await this.prisma.setting.findUnique({
            where: {
                tenantId_key: { tenantId, key },
            },
        });
        return setting?.value ?? null;
    }
    async upsert(tenantId, key, value) {
        const result = await this.prisma.setting.upsert({
            where: {
                tenantId_key: { tenantId, key },
            },
            update: { value },
            create: { tenantId, key, value },
        });
        this.revalidation.revalidateTenant(tenantId, ['settings']);
        return result;
    }
    async bulkUpsert(tenantId, settings) {
        const operations = Object.entries(settings).map(([key, value]) => this.prisma.setting.upsert({
            where: {
                tenantId_key: { tenantId, key },
            },
            update: { value },
            create: { tenantId, key, value },
        }));
        const result = await this.prisma.$transaction(operations);
        this.revalidation.revalidateTenant(tenantId, ['settings']);
        return result;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map