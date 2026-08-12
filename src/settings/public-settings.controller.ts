import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { SettingsService } from './settings.service';
import { PrismaService } from '../prisma/prisma.service';

const SENSITIVE_KEYS = ['oneSignalAppId', 'appStoreUrl', 'playStoreUrl'];

@Controller('api/public/settings')
@UseGuards(TenantGuard)
export class PublicSettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Herkese açık ayarlar. Tenant'ın meta bilgisini de (locale, timezone,
   * name) buraya katıyoruz — site tarafı `html lang`, JSON-LD ve Google
   * News sitemap için ihtiyaç duyuyor. Bu değerler `Tenant` modelinde ayrı
   * kolonlar olarak duruyor, `settings` tablosunda değil.
   *
   * Hassas anahtarlar (oneSignal, mağaza URL'leri) çıkarılır.
   */
  @Get()
  async getPublic(@CurrentTenant() tenantId: string) {
    const [all, tenant] = await Promise.all([
      this.settingsService.getAll(tenantId),
      this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true, locale: true, timezone: true },
      }),
    ]);
    for (const key of SENSITIVE_KEYS) {
      delete all[key];
    }
    // `siteTitle` set edilmemişse tenant adına düşülür — beyaz etikette bir
    // müşteriye başka müşterinin markası yansıtmamak için önemli.
    if (!all.siteTitle && tenant?.name) all.siteTitle = tenant.name;
    if (tenant?.locale) all.locale = tenant.locale;
    if (tenant?.timezone) all.timezone = tenant.timezone;
    return all;
  }
}
