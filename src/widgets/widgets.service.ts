import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.widget.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findActive(tenantId: string) {
    return this.prisma.widget.findMany({
      where: { tenantId, active: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByType(tenantId: string, type: string) {
    return this.prisma.widget.findUnique({
      where: { tenantId_type: { tenantId, type } },
    });
  }

  async upsert(tenantId: string, type: string, data: { config?: any; active?: boolean; sortOrder?: number }) {
    return this.prisma.widget.upsert({
      where: { tenantId_type: { tenantId, type } },
      create: { tenantId, type, ...data },
      update: data,
    });
  }

  async updateCache(tenantId: string, type: string, cache: any) {
    return this.prisma.widget.update({
      where: { tenantId_type: { tenantId, type } },
      data: { cache, cachedAt: new Date() },
    });
  }

  async remove(tenantId: string, type: string) {
    return this.prisma.widget.delete({
      where: { tenantId_type: { tenantId, type } },
    });
  }
}
