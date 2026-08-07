import { Controller, Get, Res, UseGuards, Header } from '@nestjs/common';
import type { Response } from 'express';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { SeoService } from './seo.service';

@Controller('api/seo')
@UseGuards(TenantGuard)
export class SeoController {
  constructor(private readonly seo: SeoService) {}

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=1800, s-maxage=1800')
  async sitemap(
    @CurrentTenant() tenantId: string,
    @Res() res: Response,
  ): Promise<void> {
    const xml = await this.seo.buildSitemap(tenantId);
    res.send(xml);
  }

  @Get('rss.xml')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  @Header('Cache-Control', 'public, max-age=600, s-maxage=600')
  async rss(
    @CurrentTenant() tenantId: string,
    @Res() res: Response,
  ): Promise<void> {
    const xml = await this.seo.buildRss(tenantId);
    res.send(xml);
  }
}
