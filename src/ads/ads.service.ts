import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { AdPosition } from '@prisma/client';

@Injectable()
export class AdsService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

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
        active: true,
        // Reklam bu pozisyonda mı: tekil `position` eşleşsin VEYA çoklu
        // `positions` dizisi bu pozisyonu içersin. Tarih koşulları AND içinde.
        OR: [{ position }, { positions: { has: position } }],
        AND: [
          {
            OR: [{ startsAt: null }, { startsAt: { lte: todayEnd } }],
          },
          {
            OR: [{ endsAt: null }, { endsAt: { gte: todayStart } }],
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
    // Çoklu pozisyon: `positions` doluysa onu kullan; değilse eski `position`.
    // En az bir pozisyon şart. `position` birincil = positions[0].
    const positions =
      dto.positions && dto.positions.length > 0
        ? dto.positions
        : dto.position
          ? [dto.position]
          : [];
    if (positions.length === 0) {
      throw new BadRequestException('En az bir reklam pozisyonu seçilmeli.');
    }
    const result = await this.prisma.ad.create({
      data: {
        tenantId,
        name: dto.name,
        position: positions[0],
        positions,
        sliderSeconds: dto.sliderSeconds ?? null,
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
    this.revalidation.revalidateTenant(tenantId, ['ads']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdateAdDto) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    const { positions: dtoPositions, position: dtoPosition, startsAt, endsAt, ...rest } = dto;
    const result = await this.prisma.ad.update({
      where: { id },
      data: {
        ...rest,
        ...(startsAt && { startsAt: new Date(startsAt) }),
        ...(endsAt && { endsAt: new Date(endsAt) }),
        // Pozisyonlar verildiyse hem çoklu diziyi hem birincil (position[0])
        // senkron güncelle; verilmediyse dokunma.
        ...(dtoPositions && dtoPositions.length > 0
          ? { positions: dtoPositions, position: dtoPositions[0] }
          : dtoPosition
            ? { positions: [dtoPosition], position: dtoPosition }
            : {}),
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['ads']);
    return result;
  }

  async remove(tenantId: string, id: string) {
    const ad = await this.prisma.ad.findFirst({
      where: { id, tenantId },
    });

    if (!ad) {
      throw new NotFoundException('Ad not found');
    }

    await this.prisma.ad.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['ads']);
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
