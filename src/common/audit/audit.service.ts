import { Injectable, Logger } from '@nestjs/common';
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
   * Fetch a tenant's recent audit log entries with optional entity filter.
   */
  async list(params: {
    tenantId: string;
    entity?: string;
    entityId?: string;
    userId?: string;
    limit?: number;
  }) {
    return this.prisma.auditLog.findMany({
      where: {
        tenantId: params.tenantId,
        ...(params.entity && { entity: params.entity }),
        ...(params.entityId && { entityId: params.entityId }),
        ...(params.userId && { userId: params.userId }),
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 50,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
