import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

type MenuItem = { label: string; url: string; order: number };

const STATIC_MENU_DEFAULTS: Record<
  string,
  { label: string | null; items: MenuItem[] }
> = {
  'header-corporate': {
    label: null,
    items: [
      { label: 'İhbar Hattı', url: '/ihbar', order: 0 },
      { label: 'Resmi İlanlar', url: '/resmi-ilanlar', order: 1 },
      { label: 'Haber Arşivi', url: '/arsiv', order: 2 },
      { label: 'Künye', url: '/kunye', order: 3 },
    ],
  },
  'footer-servisler': {
    label: 'Servisler',
    items: [
      { label: 'Nöbetçi Eczaneler', url: '/nobetci-eczaneler', order: 0 },
      { label: 'Hava Durumu', url: '/hava-durumu', order: 1 },
      { label: 'Namaz Vakitleri', url: '/namaz-vakitleri', order: 2 },
      { label: 'Gazete Manşetleri', url: '/gazete-arsivi', order: 3 },
      { label: 'Resmi İlanlar', url: '/resmi-ilanlar', order: 4 },
    ],
  },
  'footer-icerik': {
    label: 'İçerik',
    items: [
      { label: 'Video Galeri', url: '/video-galeri', order: 0 },
      { label: 'Foto Galeri', url: '/foto-galeri', order: 1 },
      { label: 'Köşe Yazarları', url: '/kose-yazarlari', order: 2 },
      { label: 'Haber Arşivi', url: '/arsiv', order: 3 },
      { label: 'İhbar Hattı', url: '/ihbar', order: 4 },
    ],
  },
  'footer-kurumsal': {
    label: 'Kurumsal',
    items: [
      { label: 'Künye', url: '/kunye', order: 0 },
      { label: 'İletişim', url: '/iletisim', order: 1 },
      { label: 'İçerik Kaldırma Talebi', url: '/icerik-kaldirma', order: 2 },
    ],
  },
};

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findAll(tenantId: string) {
    return this.prisma.menu.findMany({
      where: { tenantId },
      orderBy: { location: 'asc' },
    });
  }

  async findByLocation(tenantId: string, location: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { tenantId_location: { tenantId, location } },
    });

    // Eski tenant'ların bir kısmında menü satırları hiç oluşturulmamış,
    // bazılarında da eski içe aktarımdan `items: [[]]` kalmış. Panel bu ham
    // JSON'u alınca boş bir form gösteriyor ve siteyle aynı başlangıç
    // menüsünü düzenleyemiyordu. Geçerli öğeleri ayıklayıp boş/bozuk kaydı
    // sitenin gerçek varsayılanlarıyla dolduruyoruz; ilk Kaydet'te upsert ile
    // tenant'a ait kalıcı kayda dönüşür.
    const items = this.normalizeItems(menu?.items);
    if (items.length > 0) return { ...menu, items };

    const fallback = await this.defaultForLocation(tenantId, location);
    return {
      ...(menu ?? {}),
      location,
      label: menu?.label ?? fallback.label,
      items: fallback.items,
    };
  }

  private normalizeItems(value: unknown): MenuItem[] {
    if (!Array.isArray(value)) return [];
    return value
      .filter(
        (item): item is { label: string; url: string; order?: number } =>
          !!item &&
          typeof item === 'object' &&
          typeof (item as { label?: unknown }).label === 'string' &&
          typeof (item as { url?: unknown }).url === 'string' &&
          (item as { label: string }).label.trim().length > 0 &&
          (item as { url: string }).url.trim().length > 0,
      )
      .map((item, index) => ({
        label: item.label.trim(),
        url: item.url.trim(),
        order: Number.isInteger(item.order) ? item.order! : index,
      }))
      .sort((a, b) => a.order - b.order)
      .map((item, order) => ({ ...item, order }));
  }

  private async defaultForLocation(
    tenantId: string,
    location: string,
  ): Promise<{ label: string | null; items: MenuItem[] }> {
    if (location === 'header-main' || location === 'footer-kategoriler') {
      const categories = await this.prisma.category.findMany({
        where: { tenantId, active: true },
        // Kategori servisinin mevcut ana menü sırasını birebir koru.
        orderBy: { sortOrder: 'asc' },
        select: { name: true, slug: true },
      });
      return {
        label: location === 'footer-kategoriler' ? 'Kategoriler' : null,
        items: categories.map((category, order) => ({
          label: category.name,
          // `/kategori` uygulamanın her kurulumda var olan kanonik route'u;
          // site tarafı bu kayıtları doğrudan kullanır.
          url: `/kategori/${category.slug}`,
          order,
        })),
      };
    }

    return STATIC_MENU_DEFAULTS[location] ?? { label: null, items: [] };
  }

  async upsert(tenantId: string, dto: CreateMenuDto) {
    const items = dto.items as unknown as any;
    const result = await this.prisma.menu.upsert({
      where: { tenantId_location: { tenantId, location: dto.location } },
      update: { items, label: dto.label ?? null },
      create: { tenantId, location: dto.location, items, label: dto.label ?? null },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }

  async update(tenantId: string, location: string, dto: UpdateMenuDto) {
    const updateData: { items?: any; label?: string | null } = {};
    if (dto.items !== undefined) updateData.items = dto.items as unknown as any;
    if (dto.label !== undefined) updateData.label = dto.label || null;
    const result = await this.prisma.menu.upsert({
      where: { tenantId_location: { tenantId, location } },
      update: updateData,
      create: {
        tenantId,
        location,
        items: (dto.items ?? []) as unknown as any,
        label: dto.label ?? null,
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }

  async remove(tenantId: string, location: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { tenantId_location: { tenantId, location } },
    });
    if (!menu) throw new NotFoundException('Menu not found');
    const result = await this.prisma.menu.delete({
      where: { tenantId_location: { tenantId, location } },
    });
    this.revalidation.revalidateTenant(tenantId, ['menus']);
    return result;
  }
}
