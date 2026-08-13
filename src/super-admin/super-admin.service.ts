import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { WidgetFeederService } from '../widgets/widget-feeder.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ResetAdminPasswordDto, UpdateTenantDto } from './dto/update-tenant.dto';

const TENANT_LIST_SELECT = {
  id: true,
  name: true,
  slug: true,
  domain: true,
  subdomain: true,
  logo: true,
  mediaBaseUrl: true,
  plan: true,
  theme: true,
  // locale/timezone panelde düzenlenebiliyor; listede de göründüğünden
  // düzenleme formu tenant'ın kayıtlı değerini önceden dolduruyor.
  locale: true,
  timezone: true,
  active: true,
  createdAt: true,
  _count: {
    select: { users: true, articles: true, media: true, categories: true },
  },
} as const;

@Injectable()
export class SuperAdminService {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly feeder: WidgetFeederService,
  ) {}

  // ── Genel bakış ───────────────────────────────────────────────

  async overview() {
    const [tenants, activeTenants, users, articles] = await Promise.all([
      this.prisma.tenant.count(),
      this.prisma.tenant.count({ where: { active: true } }),
      this.prisma.user.count(),
      this.prisma.article.count(),
    ]);
    return { tenants, activeTenants, users, articles };
  }

  // ── Tenant CRUD ───────────────────────────────────────────────

  async findAll() {
    return this.prisma.tenant.findMany({
      select: TENANT_LIST_SELECT,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
      select: {
        ...TENANT_LIST_SELECT,
        favicon: true,
        locale: true,
        timezone: true,
        users: {
          where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            role: true,
            active: true,
            lastLoginAt: true,
          },
        },
      },
    });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async create(dto: CreateTenantDto) {
    // Benzersizlik ön kontrolleri — anlaşılır hata mesajları için
    const clash = await this.prisma.tenant.findFirst({
      where: {
        OR: [
          { slug: dto.slug },
          ...(dto.domain ? [{ domain: dto.domain }] : []),
          ...(dto.subdomain ? [{ subdomain: dto.subdomain }] : []),
        ],
      },
      select: { slug: true, domain: true, subdomain: true },
    });
    if (clash) {
      if (clash.slug === dto.slug)
        throw new ConflictException('Bu slug zaten kullanılıyor');
      if (dto.domain && clash.domain === dto.domain)
        throw new ConflictException('Bu domain zaten kullanılıyor');
      throw new ConflictException('Bu subdomain zaten kullanılıyor');
    }

    const passwordHash = await bcrypt.hash(dto.adminPassword, 10);
    const city = dto.city?.trim() || 'İstanbul';
    const bootstrap = dto.bootstrapDefaults !== false;

    const tenant = await this.prisma.$transaction(async (tx) => {
      const created = await tx.tenant.create({
        data: {
          name: dto.name,
          slug: dto.slug,
          domain: dto.domain?.trim() || null,
          subdomain: dto.subdomain?.trim() || null,
          logo: dto.logo?.trim() || null,
          plan: dto.plan ?? 'starter',
          settings: { city },
        },
      });

      await tx.user.create({
        data: {
          tenantId: created.id,
          name: dto.adminName,
          email: dto.adminEmail.toLowerCase(),
          username: dto.adminUsername?.toLowerCase() ?? null,
          passwordHash,
          role: 'ADMIN',
        },
      });

      if (bootstrap) {
        // Site ayarları — FE'nin okuduğu tüm anahtarlar, güvenli default'larla
        const siteUrl = dto.domain
          ? `https://${dto.domain}`
          : dto.subdomain
          ? `https://${dto.subdomain}.habersite.com`
          : `https://${dto.slug}.habersite.com`;
        const settings: Array<[string, any]> = [
          ['siteTitle', dto.name],
          ['siteDescription', `${dto.name} - Haberler ve son dakika gelişmeleri`],
          ['siteUrl', siteUrl],
          ['favicon', '/favicon.png'],
          ['contactEmail', dto.adminEmail],
          ['contactPhone', ''],
          ['contactAddress', ''],
          ['primaryColor', dto.primaryColor ?? '#1e40af'],
          ['secondaryColor', '#111827'],
          ['fontFamily', 'MontserratGP'],
          ['copyrightText', `© ${new Date().getFullYear()} ${dto.name}. Tüm hakları saklıdır.`],
          ['footerDescription', `${dto.name} - Güncel haberler ve son dakika gelişmeleri.`],
          ['footerDisclaimer', ''],
          ['homeTitleSuffix', ''],
          ['headerCtaLabel', ''],
          ['headerCtaUrl', ''],
          ['companyName', dto.name],
          ['companyTitle', 'İmtiyaz Sahibi'],
          ['editorName', dto.adminName],
          ['layout', 'default'],
          ['facebookUrl', ''],
          ['twitterUrl', ''],
          ['instagramUrl', ''],
          ['youtubeUrl', ''],
          ['whatsappUrl', ''],
          ['logo', dto.logo || '/assets/logo.png'],
        ];
        for (const [key, value] of settings) {
          await tx.setting.create({
            data: { tenantId: created.id, key, value },
          });
        }

        // Canlı beslemeli widget'lar
        const widgets: Array<{ type: string; config: any; sortOrder: number }> = [
          { type: 'weather', config: { city }, sortOrder: 1 },
          { type: 'prayer-times', config: { city, country: 'Turkey', method: 13 }, sortOrder: 2 },
          {
            type: 'market-ticker',
            config: {
              pairs: [
                { from: 'USD', to: 'TRY', label: 'Dolar' },
                { from: 'EUR', to: 'TRY', label: 'Euro' },
                { from: 'GBP', to: 'TRY', label: 'Sterlin' },
              ],
            },
            sortOrder: 3,
          },
          { type: 'horoscope', config: {}, sortOrder: 4 },
          { type: 'newspapers', config: {}, sortOrder: 5 },
          { type: 'pharmacy', config: { city }, sortOrder: 6 },
          {
            type: 'homepage-layout',
            sortOrder: 10,
            config: {
              sections: [
                { id: 'hero', type: 'hero', visible: true, order: 0, title: 'Manşet' },
                { id: 'son-haberler', type: 'category', categorySlug: '', limit: 6, visible: true, order: 1, title: 'Son Haberler' },
                { id: 'headline-slider', type: 'headline-slider', limit: 8, visible: true, order: 2, title: 'Öne Çıkanlar' },
                { id: 'cat-gundem', type: 'category', categorySlug: 'gundem', limit: 4, visible: true, order: 3, title: 'Gündem' },
                { id: 'video-gallery', type: 'video-gallery', limit: 6, visible: true, order: 4, title: 'Video Galeri' },
                { id: 'cat-spor', type: 'category', categorySlug: 'spor', limit: 4, visible: true, order: 5, title: 'Spor' },
                { id: 'cat-ekonomi', type: 'category', categorySlug: 'ekonomi', limit: 4, visible: true, order: 6, title: 'Ekonomi' },
                { id: 'newsletter', type: 'newsletter', visible: true, order: 7, title: 'Bülten' },
              ],
            },
          },
        ];
        for (const w of widgets) {
          await tx.widget.create({ data: { tenantId: created.id, ...w } });
        }

        // Varsayılan menü şablonları — admin sonradan düzenler
        const menus: Array<{ location: string; label: string | null; items: Array<{ label: string; url: string; order: number }> }> = [
          {
            location: 'header-corporate',
            label: null,
            items: [
              { label: 'Künye', url: '/kunye', order: 0 },
              { label: 'İletişim', url: '/iletisim', order: 1 },
              { label: 'Reklam', url: '/reklam', order: 2 },
            ],
          },
          {
            location: 'footer-servisler',
            label: 'Servisler',
            items: [
              { label: 'Hava Durumu', url: '/hava-durumu', order: 0 },
              { label: 'Namaz Vakitleri', url: '/namaz-vakitleri', order: 1 },
              { label: 'Nöbetçi Eczaneler', url: '/nobetci-eczaneler', order: 2 },
              { label: 'Gazete Arşivi', url: '/gazete-arsivi', order: 3 },
            ],
          },
          {
            location: 'footer-icerik',
            label: 'İçerik',
            items: [
              { label: 'Video Galeri', url: '/video-galeri', order: 0 },
              { label: 'Foto Galeri', url: '/foto-galeri', order: 1 },
              { label: 'Köşe Yazarları', url: '/kose-yazarlari', order: 2 },
              { label: 'Arşiv', url: '/arsiv', order: 3 },
            ],
          },
          {
            location: 'footer-kurumsal',
            label: 'Kurumsal',
            items: [
              { label: 'Hakkımızda', url: '/hakkimizda', order: 0 },
              { label: 'Künye', url: '/kunye', order: 1 },
              { label: 'İletişim', url: '/iletisim', order: 2 },
              { label: 'Gizlilik Politikası', url: '/gizlilik', order: 3 },
            ],
          },
        ];
        for (const m of menus) {
          await tx.menu.create({
            data: {
              tenantId: created.id,
              location: m.location,
              label: m.label,
              items: m.items as unknown as any,
            },
          });
        }

        // Başlangıç kategorileri
        const categories = [
          { name: 'Gündem', slug: 'gundem', color: '#1e40af' },
          { name: 'Ekonomi', slug: 'ekonomi', color: '#059669' },
          { name: 'Spor', slug: 'spor', color: '#16a34a' },
          { name: 'Magazin', slug: 'magazin', color: '#db2777' },
          { name: 'Dünya', slug: 'dunya', color: '#4338ca' },
        ];
        for (const [i, cat] of categories.entries()) {
          await tx.category.create({
            data: { tenantId: created.id, ...cat, sortOrder: i },
          });
        }
      }

      return created;
    });

    // Widget cache'lerini arka planda doldur — yanıtı bekletme
    // (homepage-layout config-only, feed gerektirmez)
    if (bootstrap) {
      for (const type of ['weather', 'prayer-times', 'market-ticker', 'horoscope']) {
        this.feeder
          .refreshOne(tenant.id, type)
          .catch((e) =>
            this.logger.warn(`Bootstrap feed failed (${type}): ${e?.message ?? e}`),
          );
      }
    }

    return this.findOne(tenant.id);
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.ensureExists(id);
    try {
      await this.prisma.tenant.update({
        where: { id },
        data: {
          ...(dto.name !== undefined && { name: dto.name }),
          ...(dto.slug !== undefined && { slug: dto.slug }),
          ...(dto.domain !== undefined && { domain: dto.domain?.trim() || null }),
          ...(dto.subdomain !== undefined && { subdomain: dto.subdomain?.trim() || null }),
          ...(dto.logo !== undefined && { logo: dto.logo?.trim() || null }),
          ...(dto.favicon !== undefined && { favicon: dto.favicon?.trim() || null }),
          ...(dto.mediaBaseUrl !== undefined && {
            // Sondaki eğik çizgi temizlenir; URL birleştirmede çift // olmasın.
            mediaBaseUrl: dto.mediaBaseUrl?.trim().replace(/\/+$/, '') || null,
          }),
          ...(dto.theme !== undefined && { theme: dto.theme }),
          ...(dto.plan !== undefined && { plan: dto.plan }),
          ...(dto.locale !== undefined && { locale: dto.locale }),
          ...(dto.timezone !== undefined && { timezone: dto.timezone }),
          ...(dto.active !== undefined && { active: dto.active }),
        },
      });
    } catch (e: any) {
      if (e?.code === 'P2002')
        throw new ConflictException('Slug, domain veya subdomain zaten kullanılıyor');
      throw e;
    }
    return this.findOne(id);
  }

  async remove(id: string, requesterTenantId: string) {
    if (id === requesterTenantId) {
      throw new BadRequestException('Kendi tenant hesabınızı silemezsiniz');
    }
    await this.ensureExists(id);
    // Şema onDelete: Cascade — tüm içerik birlikte silinir
    await this.prisma.tenant.delete({ where: { id } });
    return { deleted: true };
  }

  // ── Admin hesap yönetimi ──────────────────────────────────────

  async resetAdminPassword(tenantId: string, dto: ResetAdminPasswordDto) {
    if (dto.password.length < 8) {
      throw new BadRequestException('Şifre en az 8 karakter olmalı');
    }
    const admin = dto.userId
      ? await this.prisma.user.findFirst({ where: { id: dto.userId, tenantId } })
      : await this.prisma.user.findFirst({
          where: { tenantId, role: 'ADMIN' },
          orderBy: { createdAt: 'asc' },
        });
    if (!admin) throw new NotFoundException('Bu tenant için admin bulunamadı');

    const passwordHash = await bcrypt.hash(dto.password, 10);
    await this.prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash },
    });
    return { ok: true, userId: admin.id, email: admin.email };
  }

  private async ensureExists(id: string) {
    const t = await this.prisma.tenant.findUnique({ where: { id }, select: { id: true } });
    if (!t) throw new NotFoundException('Tenant not found');
  }
}
