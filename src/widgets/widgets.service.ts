import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';

@Injectable()
export class WidgetsService {
  constructor(private prisma: PrismaService, private readonly revalidation: RevalidationService) {}

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
    const result = await this.prisma.widget.upsert({
      where: { tenantId_type: { tenantId, type } },
      create: { tenantId, type, ...data },
      update: data,
    });
    this.revalidation.revalidateTenant(tenantId, ['widgets', 'homepage-layout']);
    return result;
  }

  async updateCache(tenantId: string, type: string, cache: any) {
    const result = await this.prisma.widget.update({
      where: { tenantId_type: { tenantId, type } },
      data: { cache, cachedAt: new Date() },
    });
    this.revalidation.revalidateTenant(tenantId, ['widgets']);
    return result;
  }

  async remove(tenantId: string, type: string) {
    const result = await this.prisma.widget.delete({
      where: { tenantId_type: { tenantId, type } },
    });
    this.revalidation.revalidateTenant(tenantId, ['widgets', 'homepage-layout']);
    return result;
  }
}
