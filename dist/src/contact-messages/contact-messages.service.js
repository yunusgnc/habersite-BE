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
exports.ContactMessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactMessagesService = class ContactMessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto, meta) {
        const created = await this.prisma.contactMessage.create({
            data: {
                tenantId,
                name: dto.name.trim(),
                email: dto.email.trim().toLowerCase(),
                phone: dto.phone?.trim() || null,
                subject: dto.subject?.trim() || null,
                message: dto.message.trim(),
                ipAddress: meta.ipAddress ?? null,
                userAgent: meta.userAgent ?? null,
            },
        });
        return { ok: true, id: created.id };
    }
    async findAll(tenantId, opts = {}) {
        const take = Math.min(opts.limit ?? 25, 100);
        const items = await this.prisma.contactMessage.findMany({
            where: { tenantId, ...(opts.unreadOnly ? { read: false } : {}) },
            take: take + 1,
            ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
            orderBy: { createdAt: 'desc' },
        });
        const hasMore = items.length > take;
        return {
            data: hasMore ? items.slice(0, take) : items,
            nextCursor: hasMore ? items[take - 1].id : null,
        };
    }
    async stats(tenantId) {
        const [total, unread] = await Promise.all([
            this.prisma.contactMessage.count({ where: { tenantId } }),
            this.prisma.contactMessage.count({ where: { tenantId, read: false } }),
        ]);
        return { total, unread };
    }
    async markRead(tenantId, id, read = true) {
        await this.ensureExists(tenantId, id);
        return this.prisma.contactMessage.update({
            where: { id },
            data: { read },
        });
    }
    async remove(tenantId, id) {
        await this.ensureExists(tenantId, id);
        await this.prisma.contactMessage.delete({ where: { id } });
        return { deleted: true };
    }
    async ensureExists(tenantId, id) {
        const msg = await this.prisma.contactMessage.findFirst({
            where: { id, tenantId },
            select: { id: true },
        });
        if (!msg)
            throw new common_1.NotFoundException('Message not found');
    }
};
exports.ContactMessagesService = ContactMessagesService;
exports.ContactMessagesService = ContactMessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ContactMessagesService);
//# sourceMappingURL=contact-messages.service.js.map