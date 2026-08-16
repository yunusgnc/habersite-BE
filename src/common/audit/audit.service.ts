import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'UNPUBLISH'
  | 'ARCHIVE'
  | 'RESTORE'
  | 'APPROVE'
  | 'REJECT'
  | 'LOGIN'
  | 'LOGOUT';

export type ListParams = {
  tenantId: string;
  entity?: string;
  entityId?: string;
  userId?: string;
  action?: string;
  search?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
};

/**
 * Fire-and-forget audit log writer. Called from services after successful
 * mutations. Failures never propagate — a broken audit log must not block a
 * user from finishing their action.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    tenantId: string;
    userId?: string | null;
    action: AuditAction;
    entity: string;
    entityId?: string;
    changes?: Record<string, any>;
    ipAddress?: string;
  }): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          tenantId: params.tenantId,
          userId: params.userId ?? null,
          action: params.action,
          entity: params.entity,
          entityId: params.entityId ?? null,
          changes: params.changes as any,
          ipAddress: params.ipAddress ?? null,
        },
      });
    } catch (e: any) {
      this.logger.warn(`Audit log failed: ${e?.message ?? e}`);
    }
  }

  /**
   * Cursor-paginated audit log listing with rich filters.
   * Returns `{ items, nextCursor, total }`.
   */
  async list(params: ListParams) {
    const limit = Math.min(200, params.limit ?? 50);
    const where = this.buildWhere(params);

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        // id tiebreaker: createdAt unique degil, cursor pagination deterministik siralama ister.
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        take: limit + 1,
        ...(params.cursor && { cursor: { id: params.cursor }, skip: 1 }),
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    // İmleç döndürülen son kayıt olmalı — `skip: 1` ile birlikte aksi hâlde
    // her sayfa sınırında bir kayıt atlanıyor (bkz. articles.service findAll).
    // Denetim kayıtlarında bu ayrıca ciddi: atlanan satır, geriye dönük
    // incelemede hiç olmamış gibi görünür.
    const hasMore = items.length > limit;
    if (hasMore) items.pop();
    const nextCursor = hasMore ? (items[items.length - 1]?.id ?? null) : null;
    return { items, nextCursor, total };
  }

  /**
   * Aggregate counts per action — small footer stat for the audit page.
   */
  async summary(params: ListParams) {
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

  /**
   * Load rows suitable for CSV export — no limit cap beyond a safety ceiling.
   */
  async exportRows(params: ListParams) {
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

  private buildWhere(p: ListParams): Prisma.AuditLogWhereInput {
    const where: Prisma.AuditLogWhereInput = { tenantId: p.tenantId };
    if (p.entity) where.entity = p.entity;
    if (p.entityId) where.entityId = p.entityId;
    if (p.userId) where.userId = p.userId;
    if (p.action) where.action = p.action;
    if (p.from || p.to) {
      where.createdAt = {};
      if (p.from) (where.createdAt as any).gte = new Date(p.from);
      if (p.to) {
        const to = new Date(p.to);
        to.setHours(23, 59, 59, 999);
        (where.createdAt as any).lte = to;
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
}
