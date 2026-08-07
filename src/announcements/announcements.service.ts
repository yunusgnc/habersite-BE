import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.announcement.findMany({
      where: { tenantId },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(tenantId: string, id: string) {
    const announcement = await this.prisma.announcement.findFirst({
      where: { id, tenantId },
    });

    if (!announcement) {
      throw new NotFoundException('Announcement not found');
    }

    return announcement;
  }

  async findActive(tenantId: string) {
    return this.prisma.announcement.findMany({
      where: {
        tenantId,
        active: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async create(tenantId: string, dto: CreateAnnouncementDto) {
    return this.prisma.announcement.create({
      data: {
        ...dto,
        tenantId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateAnnouncementDto) {
    await this.findOne(tenantId, id);

    return this.prisma.announcement.update({
      where: { id },
      data: {
        ...dto,
        expiresAt: dto.expiresAt !== undefined
          ? dto.expiresAt
            ? new Date(dto.expiresAt)
            : null
          : undefined,
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return this.prisma.announcement.delete({
      where: { id },
    });
  }
}
