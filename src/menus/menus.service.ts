import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findAll(tenantId: string) {
    return this.prisma.menu.findMany({
      where: { tenantId },
      orderBy: { location: 'asc' },
    });
  }

  async findByLocation(tenantId: string, location: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { tenantId_location: { tenantId, location } },
    });
    if (!menu) return { location, items: [] };
    return menu;
  }

  async upsert(tenantId: string, dto: CreateMenuDto) {
    const items = dto.items as unknown as any;
    const result = await this.prisma.menu.upsert({
      where: { tenantId_location: { tenantId, location: dto.location } },
      update: { items, label: dto.label ?? null },
      create: { tenantId, location: dto.location, items, label: dto.label ?? null },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }

  async update(tenantId: string, location: string, dto: UpdateMenuDto) {
    const updateData: { items?: any; label?: string | null } = {};
    if (dto.items !== undefined) updateData.items = dto.items as unknown as any;
    if (dto.label !== undefined) updateData.label = dto.label || null;
    const result = await this.prisma.menu.upsert({
      where: { tenantId_location: { tenantId, location } },
      update: updateData,
      create: {
        tenantId,
        location,
        items: (dto.items ?? []) as unknown as any,
        label: dto.label ?? null,
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }

  async remove(tenantId: string, location: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { tenantId_location: { tenantId, location } },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    const result = await this.prisma.menu.delete({
      where: { tenantId_location: { tenantId, location } },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }
}
