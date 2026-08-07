import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewslettersService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.newsletterSubscriber.findMany({
      where: { tenantId, unsubscribed: false },
      orderBy: { createdAt: 'desc' },
    });
  }

  async subscribe(tenantId: string, email: string, name?: string) {
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });

    if (existing) {
      if (existing.unsubscribed) {
        return this.prisma.newsletterSubscriber.update({
          where: { id: existing.id },
          data: { unsubscribed: false, name },
        });
      }
      throw new ConflictException('Already subscribed');
    }

    return this.prisma.newsletterSubscriber.create({
      data: { tenantId, email, name },
    });
  }

  async unsubscribe(tenantId: string, email: string) {
    return this.prisma.newsletterSubscriber.updateMany({
      where: { tenantId, email },
      data: { unsubscribed: true },
    });
  }

  async getCount(tenantId: string) {
    return this.prisma.newsletterSubscriber.count({
      where: { tenantId, unsubscribed: false },
    });
  }
}
