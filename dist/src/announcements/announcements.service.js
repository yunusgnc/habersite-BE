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
exports.AnnouncementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const revalidation_service_1 = require("../common/revalidation/revalidation.service");
let AnnouncementsService = class AnnouncementsService {
    prisma;
    revalidation;
    constructor(prisma, revalidation) {
        this.prisma = prisma;
        this.revalidation = revalidation;
    }
    async findAll(tenantId) {
        return this.prisma.announcement.findMany({
            where: { tenantId },
            orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(tenantId, id) {
        const announcement = await this.prisma.announcement.findFirst({
            where: { id, tenantId },
        });
        if (!announcement) {
            throw new common_1.NotFoundException('Announcement not found');
        }
        return announcement;
    }
    async findActive(tenantId) {
        return this.prisma.announcement.findMany({
            where: {
                tenantId,
                active: true,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } },
                ],
            },
            orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        });
    }
    async create(tenantId, dto) {
        const result = await this.prisma.announcement.create({
            data: {
                ...dto,
                tenantId,
                expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['announcements']);
        return result;
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        const result = await this.prisma.announcement.update({
            where: { id },
            data: {
                ...dto,
                expiresAt: dto.expiresAt !== undefined
                    ? dto.expiresAt
                        ? new Date(dto.expiresAt)
                        : null
                    : undefined,
            },
        });
        this.revalidation.revalidateTenant(tenantId, ['announcements']);
        return result;
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        const result = await this.prisma.announcement.delete({
            where: { id },
        });
        this.revalidation.revalidateTenant(tenantId, ['announcements']);
        return result;
    }
};
exports.AnnouncementsService = AnnouncementsService;
exports.AnnouncementsService = AnnouncementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, revalidation_service_1.RevalidationService])
], AnnouncementsService);
//# sourceMappingURL=announcements.service.js.map