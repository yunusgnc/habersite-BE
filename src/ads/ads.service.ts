import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AdPosition } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByPosition(tenantId: string, position: AdPosition) {
    // Compare using day boundaries so a date-only input like "2026-08-03"
    // (stored as 2026-08-03T00:00Z) counts as "started" for anyone whose local
    // date is Aug 3, regardless of the current UTC hour.
    const now = new Date();
    // Use server-local day boundaries (server assumed to run in a tz close to users).
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    return this.prisma.ad.findMany({
      where: {
        tenantId,
        position,
        active: true,
        OR: [
          { startsAt: null },
          { startsAt: { lte: todayEnd } },
        ],
        AND: [
          {
            OR: [
              { endsAt: null },
              { endsAt: { gte: todayStart } },
            ],
          },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.ad.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateAdDto) {
    return this.prisma.ad.create({
      data: {
        tenantId,
        name: dto.name,
        position: dto.position,
        code: dto.code,
        imageUrl: dto.imageUrl,
        mobileImageUrl: dto.mobileImageUrl,
        targetUrl: dto.targetUrl,
        active: dto.active ?? true,
        startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
        endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateAdDto) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return this.prisma.ad.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.startsAt && { startsAt: new Date(dto.startsAt) }),
        ...(dto.endsAt && { endsAt: new Date(dto.endsAt) }),
      },
    });
  }

  async remove(tenantId: string, id: string) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    await this.prisma.ad.delete({ where: { id } });
    return { deleted: true };
  }

  async trackImpression(tenantId: string, id: string) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return this.prisma.ad.update({
      where: { id },
      data: { impressions: { increment: 1 } },
    });
  }

  async trackClick(tenantId: string, id: string) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    return this.prisma.ad.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }
}
