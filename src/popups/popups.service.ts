import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';

@Injectable()
export class PopupsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.popup.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.popup.count({ where: { tenantId } }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(tenantId: string, id: string) {
    const popup = await this.prisma.popup.findFirst({
      where: { id, tenantId },
    });

    if (!popup) {
      throw new NotFoundException('Popup not found');
    }

    return popup;
  }

  async findActive(tenantId: string) {
    const now = new Date();

    return this.prisma.popup.findMany({
      where: {
        tenantId,
        active: true,
        OR: [
          { startsAt: null },
          { startsAt: { lte: now } },
        ],
        AND: [
          {
            OR: [
              { endsAt: null },
              { endsAt: { gt: now } },
            ],
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreatePopupDto) {
    return this.prisma.popup.create({
      data: {
        tenantId,
        title: dto.title,
        content: dto.content,
        imageUrl: dto.imageUrl,
        targetUrl: dto.targetUrl,
        trigger: dto.trigger ?? 'on_load',
        delayMs: dto.delayMs ?? 0,
        active: dto.active ?? true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdatePopupDto) {
    const popup = await this.prisma.popup.findFirst({
      where: { id, tenantId },
    });

    if (!popup) {
      throw new NotFoundException('Popup not found');
    }

    return this.prisma.popup.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startsAt && { startsAt: new Date(dto.startsAt) }),
        ...(dto.endsAt && { endsAt: new Date(dto.endsAt) }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const popup = await this.prisma.popup.findFirst({
      where: { id, tenantId },
    });

    if (!popup) {
      throw new NotFoundException('Popup not found');
    }

    await this.prisma.popup.delete({ where: { id } });
    return { deleted: true };
  }
}
