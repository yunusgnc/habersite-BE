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

/**
 * İstatistiği tutulan widget türleri.
 *
 * Sayaç ucu herkese açık (ziyaretçi oturum açmış değil). Tür serbest metin
 * olsaydı herhangi biri sınırsız satır yaratabilirdi; beyaz liste tablo
 * boyutunu kiracı başına 7 tür x gün ile sınırlar.
 */
export const ISTATISTIKLI_WIDGETLAR = [
  'weather',
  'prayer-times',
  'market-ticker',
  'horoscope',
  'newspapers',
  'pharmacy',
  'standings',
] as const;

export type WidgetOlayi = 'view' | 'click';

/** Günlük kova anahtarı: UTC gece yarısı. */
function gunKovasi(tarih = new Date()): Date {
  return new Date(
    Date.UTC(tarih.getUTCFullYear(), tarih.getUTCMonth(), tarih.getUTCDate()),
  );
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

  /**
   * Görüntülenme/tıklanma sayar. Bilinmeyen tür sessizce yok sayılır —
   * ziyaretçiye hata döndürmenin bir anlamı yok, sayfa çalışmaya devam etmeli.
   */
  async track(tenantId: string, type: string, olay: WidgetOlayi) {
    if (!(ISTATISTIKLI_WIDGETLAR as readonly string[]).includes(type)) {
      return { ok: false };
    }
    const day = gunKovasi();
    const artis = olay === 'click' ? { clicks: 1 } : { impressions: 1 };
    await this.prisma.widgetStat.upsert({
      where: { tenantId_widgetType_day: { tenantId, widgetType: type, day } },
      create: { tenantId, widgetType: type, day, ...artis },
      update:
        olay === 'click'
          ? { clicks: { increment: 1 } }
          : { impressions: { increment: 1 } },
    });
    return { ok: true };
  }

  /**
   * Panel raporu: aralık toplamları, oran ve günlük seri.
   *
   * `gun` 0 ise tüm zamanlar. Seri grafiği besler; toplamlar kartları.
   */
  async stats(tenantId: string, gun = 30) {
    const since =
      gun > 0
        ? gunKovasi(new Date(Date.now() - (gun - 1) * 24 * 60 * 60 * 1000))
        : null;

    const satirlar = await this.prisma.widgetStat.findMany({
      where: { tenantId, ...(since ? { day: { gte: since } } : {}) },
      orderBy: { day: 'asc' },
    });

    const toplamlar = new Map<string, { impressions: number; clicks: number }>();
    const gunluk = new Map<string, { impressions: number; clicks: number }>();
    for (const r of satirlar) {
      const t = toplamlar.get(r.widgetType) ?? { impressions: 0, clicks: 0 };
      t.impressions += r.impressions;
      t.clicks += r.clicks;
      toplamlar.set(r.widgetType, t);

      const anahtar = r.day.toISOString().slice(0, 10);
      const g = gunluk.get(anahtar) ?? { impressions: 0, clicks: 0 };
      g.impressions += r.impressions;
      g.clicks += r.clicks;
      gunluk.set(anahtar, g);
    }

    const widgets = (ISTATISTIKLI_WIDGETLAR as readonly string[]).map((type) => {
      const t = toplamlar.get(type) ?? { impressions: 0, clicks: 0 };
      return {
        type,
        impressions: t.impressions,
        clicks: t.clicks,
        // Tıklama oranı: gösterim yoksa 0, bölme hatası olmasın.
        ctr: t.impressions > 0 ? t.clicks / t.impressions : 0,
      };
    });

    return {
      range: gun,
      widgets: widgets.sort((a, b) => b.impressions - a.impressions),
      totals: {
        impressions: widgets.reduce((a, w) => a + w.impressions, 0),
        clicks: widgets.reduce((a, w) => a + w.clicks, 0),
      },
      series: [...gunluk.entries()].map(([day, v]) => ({ day, ...v })),
    };
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
