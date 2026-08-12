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
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let ContactMessagesService = class ContactMessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(tenantId, dto, meta) {
        const type = dto.type ?? client_1.MessageType.CONTACT;
        const created = await this.prisma.contactMessage.create({
            data: {
                tenantId,
                type,
                name: dto.name.trim(),
                email: dto.email.trim().toLowerCase(),
                phone: dto.phone?.trim() || null,
                subject: dto.subject?.trim() || null,
                message: dto.message.trim(),
                targetUrl: type === client_1.MessageType.REMOVAL_REQUEST ? dto.targetUrl?.trim() || null : null,
                district: type === client_1.MessageType.TIP ? dto.district?.trim() || null : null,
                attachments: type === client_1.MessageType.TIP ? (dto.attachments ?? []) : [],
                ipAddress: meta.ipAddress ?? null,
                userAgent: meta.userAgent ?? null,
            },
            select: { id: true },
        });
        return { ok: true, id: created.id };
    }
    async findAll(tenantId, opts = {}) {
        const take = Math.min(opts.limit ?? 25, 100);
        const where = { tenantId };
        if (opts.unreadOnly)
            where.read = false;
        if (opts.type)
            where.type = opts.type;
        if (opts.status)
            where.status = opts.status;
        if (opts.search?.trim()) {
            const q = opts.search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { subject: { contains: q, mode: 'insensitive' } },
                { message: { contains: q, mode: 'insensitive' } },
            ];
        }
        const items = await this.prisma.contactMessage.findMany({
            where,
            take: take + 1,
            ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        });
        const hasMore = items.length > take;
        return {
            data: hasMore ? items.slice(0, take) : items,
            nextCursor: hasMore ? items[take - 1].id : null,
        };
    }
    async stats(tenantId) {
        const [total, unread, byType, byStatus] = await Promise.all([
            this.prisma.contactMessage.count({ where: { tenantId } }),
            this.prisma.contactMessage.count({ where: { tenantId, read: false } }),
            this.prisma.contactMessage.groupBy({
                by: ['type'],
                where: { tenantId },
                _count: { _all: true },
            }),
            this.prisma.contactMessage.groupBy({
                by: ['status'],
                where: { tenantId },
                _count: { _all: true },
            }),
        ]);
        const typeCounts = Object.fromEntries(Object.values(client_1.MessageType).map((t) => [
            t,
            byType.find((row) => row.type === t)?._count._all ?? 0,
        ]));
        const statusCounts = Object.fromEntries(Object.values(client_1.MessageStatus).map((s) => [
            s,
            byStatus.find((row) => row.status === s)?._count._all ?? 0,
        ]));
        return { total, unread, byType: typeCounts, byStatus: statusCounts };
    }
    async markRead(tenantId, id, read = true) {
        await this.ensureExists(tenantId, id);
        return this.prisma.contactMessage.update({
            where: { id },
            data: { read },
        });
    }
    async updateStatus(tenantId, id, dto) {
        await this.ensureExists(tenantId, id);
        const isClosed = dto.status === client_1.MessageStatus.RESOLVED || dto.status === client_1.MessageStatus.REJECTED;
        return this.prisma.contactMessage.update({
            where: { id },
            data: {
                status: dto.status,
                adminNote: dto.adminNote?.trim() || null,
                handledAt: isClosed ? new Date() : null,
                read: true,
            },
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