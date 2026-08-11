import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageStatus, MessageType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';

type FindAllOpts = {
  limit?: number;
  cursor?: string;
  unreadOnly?: boolean;
  type?: MessageType;
  status?: MessageStatus;
  search?: string;
};

@Injectable()
export class ContactMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    dto: CreateContactMessageDto,
    meta: { ipAddress?: string; userAgent?: string },
  ) {
    const type = dto.type ?? MessageType.CONTACT;

    const created = await this.prisma.contactMessage.create({
      data: {
        tenantId,
        type,
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone?.trim() || null,
        subject: dto.subject?.trim() || null,
        message: dto.message.trim(),
        // Tipe özel alanlar yalnızca ilgili akışta saklanır; böylece
        // iletişim formundan gelen bir istek KVKK alanlarını kirletemez.
        targetUrl:
          type === MessageType.REMOVAL_REQUEST ? dto.targetUrl?.trim() || null : null,
        district: type === MessageType.TIP ? dto.district?.trim() || null : null,
        attachments: type === MessageType.TIP ? (dto.attachments ?? []) : [],
        ipAddress: meta.ipAddress ?? null,
        userAgent: meta.userAgent ?? null,
      },
      select: { id: true },
    });

    return { ok: true, id: created.id };
  }

  async findAll(tenantId: string, opts: FindAllOpts = {}) {
    const take = Math.min(opts.limit ?? 25, 100);

    const where: Prisma.ContactMessageWhereInput = { tenantId };
    if (opts.unreadOnly) where.read = false;
    if (opts.type) where.type = opts.type;
    if (opts.status) where.status = opts.status;
    if (opts.search?.trim()) {
      const q = opts.search.trim();
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { message: { contains: q, mode: 'insensitive' } },
      ];
    }

    const items = await this.prisma.contactMessage.findMany({
      where,
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
    const [total, unread, byType, byStatus] = await Promise.all([
      this.prisma.contactMessage.count({ where: { tenantId } }),
      this.prisma.contactMessage.count({ where: { tenantId, read: false } }),
      this.prisma.contactMessage.groupBy({
        by: ['type'],
        where: { tenantId },
        _count: { _all: true },
      }),
      this.prisma.contactMessage.groupBy({
        by: ['status'],
        where: { tenantId },
        _count: { _all: true },
      }),
    ]);

    // Sıfır sayımlar da dönsün ki panelde sekme sayaçları boş kalmasın.
    const typeCounts = Object.fromEntries(
      Object.values(MessageType).map((t) => [
        t,
        byType.find((row) => row.type === t)?._count._all ?? 0,
      ]),
    ) as Record<MessageType, number>;

    const statusCounts = Object.fromEntries(
      Object.values(MessageStatus).map((s) => [
        s,
        byStatus.find((row) => row.status === s)?._count._all ?? 0,
      ]),
    ) as Record<MessageStatus, number>;

    return { total, unread, byType: typeCounts, byStatus: statusCounts };
  }

  async markRead(tenantId: string, id: string, read = true) {
    await this.ensureExists(tenantId, id);
    return this.prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
  }

  async updateStatus(tenantId: string, id: string, dto: UpdateMessageStatusDto) {
    await this.ensureExists(tenantId, id);
    const isClosed =
      dto.status === MessageStatus.RESOLVED || dto.status === MessageStatus.REJECTED;

    return this.prisma.contactMessage.update({
      where: { id },
      data: {
        status: dto.status,
        adminNote: dto.adminNote?.trim() || null,
        handledAt: isClosed ? new Date() : null,
        // Bir talebi işleme almak onu okunmuş sayar.
        read: true,
      },
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
