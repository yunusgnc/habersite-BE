import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';

@Injectable()
export class ContactMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    dto: CreateContactMessageDto,
    meta: { ipAddress?: string; userAgent?: string },
  ) {
    const created = await this.prisma.contactMessage.create({
      data: {
        tenantId,
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        subject: dto.subject?.trim() || null,
        message: dto.message.trim(),
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
      },
    });
    return { ok: true, id: created.id };
  }

  async findAll(tenantId: string, opts: { limit?: number; cursor?: string; unreadOnly?: boolean } = {}) {
    const take = Math.min(opts.limit ?? 25, 100);
    const items = await this.prisma.contactMessage.findMany({
      where: { tenantId, ...(opts.unreadOnly ? { read: false } : {}) },
      take: take + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
    });
    const hasMore = items.length > take;
    return {
      data: hasMore ? items.slice(0, take) : items,
      nextCursor: hasMore ? items[take - 1].id : null,
    };
  }

  async stats(tenantId: string) {
    const [total, unread] = await Promise.all([
      this.prisma.contactMessage.count({ where: { tenantId } }),
      this.prisma.contactMessage.count({ where: { tenantId, read: false } }),
    ]);
    return { total, unread };
  }

  async markRead(tenantId: string, id: string, read = true) {
    await this.ensureExists(tenantId, id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    await this.prisma.contactMessage.delete({ where: { id } });
    return { deleted: true };
  }

  private async ensureExists(tenantId: string, id: string) {
    const msg = await this.prisma.contactMessage.findFirst({
      where: { id, tenantId },
      select: { id: true },
    });
    if (!msg) throw new NotFoundException('Message not found');
  }
}
