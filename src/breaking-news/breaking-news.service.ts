import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';

export const BREAKING_NEWS_LIFETIME_MS = 24 * 60 * 60 * 1000;

export function breakingNewsExpiresAt(from = new Date()): Date {
  return new Date(from.getTime() + BREAKING_NEWS_LIFETIME_MS);
}

@Injectable()
export class BreakingNewsService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findActive(tenantId: string) {
    const now = new Date();
    const legacyCutoff = new Date(now.getTime() - BREAKING_NEWS_LIFETIME_MS);

    return this.prisma.breakingNews.findMany({
      where: {
        tenantId,
        active: true,
        OR: [
          { expiresAt: { gt: now } },
          // Eski kayıtlarda expiresAt boş olabilir. Bu kayıtların da süresiz
          // kalmasını engelle; oluşturulmalarından 24 saat sonra listeden düşür.
          { expiresAt: null, createdAt: { gt: legacyCutoff } },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAll(tenantId: string) {
    return this.prisma.breakingNews.findMany({
      where: { tenantId },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(tenantId: string, dto: CreateBreakingNewsDto) {
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const last = await this.prisma.breakingNews.findFirst({
        where: { tenantId },
        orderBy: { sortOrder: 'desc' },
        select: { sortOrder: true },
      });
      sortOrder = (last?.sortOrder ?? -1) + 1;
    }

    const result = await this.prisma.breakingNews.create({
      data: {
        tenantId,
        title: dto.title,
        url: dto.url,
        sortOrder,
        // Son dakika şeridi için süre istemciden değiştirilemez. Böylece kayıt
        // panelden, haber formundan veya doğrudan API'den eklense de aynı kural
        // uygulanır.
        expiresAt: breakingNewsExpiresAt(),
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['breaking-news']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdateBreakingNewsDto) {
    const item = await this.prisma.breakingNews.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      throw new NotFoundException('Breaking news not found');
    }

    const result = await this.prisma.breakingNews.update({
      where: { id },
      data: {
        ...dto,
        // Var olan kaydın 24 saatlik penceresi başlık/URL düzenlenince uzamaz.
        expiresAt:
          dto.active === true && !item.active
            ? breakingNewsExpiresAt()
            : item.expiresAt ?? breakingNewsExpiresAt(item.createdAt),
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['breaking-news']);
    return result;
  }

  async reorder(tenantId: string, ids: string[]) {
    const items = await this.prisma.breakingNews.findMany({
      where: { tenantId, id: { in: ids } },
      select: { id: true },
    });

    const validIds = new Set(items.map((i) => i.id));
    const clean = ids.filter((id) => validIds.has(id));

    await this.prisma.$transaction(
      clean.map((id, index) =>
        this.prisma.breakingNews.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );

    this.revalidation.revalidateTenant(tenantId, ['breaking-news']);
    return { updated: clean.length };
  }

  async remove(tenantId: string, id: string) {
    const item = await this.prisma.breakingNews.findFirst({
      where: { id, tenantId },
    });

    if (!item) {
      throw new NotFoundException('Breaking news not found');
    }

    await this.prisma.breakingNews.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['breaking-news']);
    return { deleted: true };
  }
}
