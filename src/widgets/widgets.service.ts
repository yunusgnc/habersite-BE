import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';

export type YerelGazeteAyari = {
  id: string;
  name: string;
  image: string;
  imageFull?: string;
  url?: string;
  date?: string;
};

/**
 * Panelden gelen yerel gazete kapaklarını güvenli ve sınırlı bir şekle sokar.
 * BİK kapaklarının üçüncü taraf kullanım uyarısı nedeniyle sunucu BİK'i
 * kazımaz; yalnızca yayın hakkı bulunan, panelden eklenen kapaklar saklanır.
 */
export function yerelGazeteleriNormalizeEt(value: unknown): YerelGazeteAyari[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 30)
    .map((item, index) => {
      const raw =
        item && typeof item === 'object'
          ? (item as Record<string, unknown>)
          : {};
      const text = (key: string, max: number) =>
        typeof raw[key] === 'string'
          ? String(raw[key]).trim().slice(0, max)
          : '';
      return {
        id: text('id', 80) || `yerel-${index + 1}`,
        name: text('name', 120),
        image: text('image', 2048),
        imageFull: text('imageFull', 2048) || undefined,
        url: text('url', 2048) || undefined,
        date: text('date', 40) || undefined,
      };
    })
    .filter((item) => item.name.length > 0 && item.image.length > 0);
}

@Injectable()
export class WidgetsService {
  constructor(
    private prisma: PrismaService,
    private readonly revalidation: RevalidationService,
  ) {}

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

  async upsert(
    tenantId: string,
    type: string,
    data: { config?: any; active?: boolean; sortOrder?: number },
  ) {
    const safeData = { ...data };
    if (
      type === 'newspapers' &&
      data.config &&
      typeof data.config === 'object'
    ) {
      safeData.config = {
        ...data.config,
        localItems: yerelGazeteleriNormalizeEt(data.config.localItems),
      };
    }
    const result = await this.prisma.widget.upsert({
      where: { tenantId_type: { tenantId, type } },
      create: { tenantId, type, ...safeData },
      update: safeData,
    });
    this.revalidation.revalidateTenant(tenantId, [
      'widgets',
      'homepage-layout',
    ]);
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
    this.revalidation.revalidateTenant(tenantId, [
      'widgets',
      'homepage-layout',
    ]);
    return result;
  }
}
