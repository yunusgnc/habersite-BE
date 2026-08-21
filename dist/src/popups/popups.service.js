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
exports.PopupsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let PopupsService = class PopupsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.prisma.popup.findMany({
                where: { tenantId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.popup.count({ where: { tenantId } }),
        ]);
        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(tenantId, id) {
        const popup = await this.prisma.popup.findFirst({
            where: { id, tenantId },
        });
        if (!popup) {
            throw new common_1.NotFoundException('Popup not found');
        }
        return popup;
    }
    async findActive(tenantId) {
        const now = new Date();
        return this.prisma.popup.findMany({
            where: {
                tenantId,
                active: true,
                OR: [
                    { startsAt: null },
                    { startsAt: { lte: now } },
                ],
                AND: [
                    {
                        OR: [
                            { endsAt: null },
                            { endsAt: { gt: now } },
                        ],
                    },
                ],
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(tenantId, dto) {
        const result = await this.prisma.popup.create({
            data: {
                tenantId,
                title: dto.title,
                content: dto.content,
                imageUrl: dto.imageUrl,
                targetUrl: dto.targetUrl,
                trigger: dto.trigger ?? 'on_load',
                delayMs: dto.delayMs ?? 0,
                active: dto.active ?? true,
                startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
                endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['popups']);
        return result;
    }
    async update(tenantId, id, dto) {
        const popup = await this.prisma.popup.findFirst({
            where: { id, tenantId },
        });
        if (!popup) {
            throw new common_1.NotFoundException('Popup not found');
        }
        const result = await this.prisma.popup.update({
            where: { id },
            data: {
                ...dto,
                ...(dto.startsAt && { startsAt: new Date(dto.startsAt) }),
                ...(dto.endsAt && { endsAt: new Date(dto.endsAt) }),
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['popups']);
        return result;
    }
    async remove(tenantId, id) {
        const popup = await this.prisma.popup.findFirst({
            where: { id, tenantId },
        });
        if (!popup) {
            throw new common_1.NotFoundException('Popup not found');
        }
        await this.prisma.popup.delete({ where: { id } });
        this.revalidation.revalidateTenant(tenantId, ['popups']);
        return { deleted: true };
    }
};
exports.PopupsService = PopupsService;
exports.PopupsService = PopupsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], PopupsService);
//# sourceMappingURL=popups.service.js.map