import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, options?: { cursor?: string; limit?: number; entity?: string }) {
    const limit = options?.limit ?? 50;
    return this.prisma.auditLog.findMany({
      where: {
        tenantId,
        ...(options?.entity && { entity: options.entity }),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(options?.cursor && { cursor: { id: options.cursor }, skip: 1 }),
    });
  }

  async create(data: {
    tenantId: string;
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    changes?: any;
    ipAddress?: string;
  }) {
    return this.prisma.auditLog.create({ data });
  }
}
