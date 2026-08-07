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
exports.AdsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AdsService = class AdsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPosition(tenantId, position) {
        const now = new Date();
        const todayEnd = new Date(now);
        todayEnd.setHours(23, 59, 59, 999);
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return this.prisma.ad.findMany({
            where: {
                tenantId,
                position,
                active: true,
                OR: [
                    { startsAt: null },
                    { startsAt: { lte: todayEnd } },
                ],
                AND: [
                    {
                        OR: [
                            { endsAt: null },
                            { endsAt: { gte: todayStart } },
                        ],
                    },
                ],
            },
            orderBy: { sortOrder: 'asc' },
        });
    }
    async findAll(tenantId) {
        return this.prisma.ad.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(tenantId, dto) {
        return this.prisma.ad.create({
            data: {
                tenantId,
                name: dto.name,
                position: dto.position,
                code: dto.code,
                imageUrl: dto.imageUrl,
                mobileImageUrl: dto.mobileImageUrl,
                targetUrl: dto.targetUrl,
                active: dto.active ?? true,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
                endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
                sortOrder: dto.sortOrder ?? 0,
            },
        });
    }
    async update(tenantId, id, dto) {
        const ad = await this.prisma.ad.findFirst({
            where: { id, tenantId },
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
        }
        return this.prisma.ad.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.startsAt && { startsAt: new Date(dto.startsAt) }),
                ...(dto.endsAt && { endsAt: new Date(dto.endsAt) }),
            },
        });
    }
    async remove(tenantId, id) {
        const ad = await this.prisma.ad.findFirst({
            where: { id, tenantId },
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
        }
        await this.prisma.ad.delete({ where: { id } });
        return { deleted: true };
    }
    async trackImpression(tenantId, id) {
        const ad = await this.prisma.ad.findFirst({
            where: { id, tenantId },
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
        }
        return this.prisma.ad.update({
            where: { id },
            data: { impressions: { increment: 1 } },
        });
    }
    async trackClick(tenantId, id) {
        const ad = await this.prisma.ad.findFirst({
            where: { id, tenantId },
        });
        if (!ad) {
            throw new common_1.NotFoundException('Ad not found');
        }
        return this.prisma.ad.update({
            where: { id },
            data: { clicks: { increment: 1 } },
        });
    }
};
exports.AdsService = AdsService;
exports.AdsService = AdsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdsService);
//# sourceMappingURL=ads.service.js.map