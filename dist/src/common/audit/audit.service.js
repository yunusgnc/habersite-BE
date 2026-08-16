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
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AuditService = AuditService_1 = class AuditService {
    prisma;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async log(params) {
        try {
            await this.prisma.auditLog.create({
                data: {
                    tenantId: params.tenantId,
                    userId: params.userId ?? null,
                    action: params.action,
                    entity: params.entity,
                    entityId: params.entityId ?? null,
                    changes: params.changes,
                    ipAddress: params.ipAddress ?? null,
                },
            });
        }
        catch (e) {
            this.logger.warn(`Audit log failed: ${e?.message ?? e}`);
        }
    }
    async list(params) {
        const limit = Math.min(200, params.limit ?? 50);
        const where = this.buildWhere(params);
        const [items, total] = await Promise.all([
            this.prisma.auditLog.findMany({
                where,
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
                take: limit + 1,
                ...(params.cursor && { cursor: { id: params.cursor }, skip: 1 }),
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.auditLog.count({ where }),
        ]);
        const hasMore = items.length > limit;
        if (hasMore)
            items.pop();
        const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;
        return { items, nextCursor, total };
    }
    async summary(params) {
        const where = this.buildWhere(params);
        const groups = await this.prisma.auditLog.groupBy({
            by: ['action'],
            where,
            _count: { _all: true },
        });
        const total = groups.reduce((s, g) => s + g._count._all, 0);
        return {
            total,
            byAction: Object.fromEntries(groups.map((g) => [g.action, g._count._all])),
        };
    }
    async exportRows(params) {
        const where = this.buildWhere(params);
        const items = await this.prisma.auditLog.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 10_000,
            include: {
                user: { select: { name: true, email: true } },
            },
        });
        return items;
    }
    buildWhere(p) {
        const where = { tenantId: p.tenantId };
        if (p.entity)
            where.entity = p.entity;
        if (p.entityId)
            where.entityId = p.entityId;
        if (p.userId)
            where.userId = p.userId;
        if (p.action)
            where.action = p.action;
        if (p.from || p.to) {
            where.createdAt = {};
            if (p.from)
                where.createdAt.gte = new Date(p.from);
            if (p.to) {
                const to = new Date(p.to);
                to.setHours(23, 59, 59, 999);
                where.createdAt.lte = to;
            }
        }
        if (p.search) {
            const q = p.search;
            where.OR = [
                { entityId: { contains: q, mode: 'insensitive' } },
                { entity: { contains: q, mode: 'insensitive' } },
            ];
        }
        return where;
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditService);
//# sourceMappingURL=audit.service.js.map