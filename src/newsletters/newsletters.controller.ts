import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';
import {
  CreateCampaignDto,
  ListCampaignsQuery,
  UpdateCampaignDto,
} from './dto/newsletter-campaign.dto';

@Controller('api/newsletters')
@UseGuards(TenantGuard)
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

  // ─── Public — abone ol / abonelikten çık ─────────────────

  @Post('subscribe')
  subscribe(
    @CurrentTenant() tenantId: string,
    @Body() body: { email: string; name?: string },
  ) {
    return this.newslettersService.subscribe(tenantId, body.email, body.name);
  }

  @Post('unsubscribe')
  unsubscribe(
    @CurrentTenant() tenantId: string,
    @Body() body: { email: string },
  ) {
    return this.newslettersService.unsubscribe(tenantId, body.email);
  }

  // ─── Panel — aboneler ────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  findAll(@CurrentTenant() tenantId: string) {
    return this.newslettersService.findAll(tenantId);
  }

  @Get('count')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  getCount(@CurrentTenant() tenantId: string) {
    return this.newslettersService.getCount(tenantId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.newslettersService.remove(tenantId, id);
  }

  // ─── Panel — kampanyalar ─────────────────────────────────

  @Get('campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  listCampaigns(
    @CurrentTenant() tenantId: string,
    @Query() query: ListCampaignsQuery,
  ) {
    return this.newslettersService.listCampaigns(tenantId, query);
  }

  @Get('campaigns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  getCampaign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.newslettersService.getCampaign(tenantId, id);
  }

  @Post('campaigns')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  createCampaign(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: { id?: string } | undefined,
    @Body() dto: CreateCampaignDto,
  ) {
    return this.newslettersService.createCampaign(
      tenantId,
      user?.id ?? null,
      dto,
    );
  }

  @Patch('campaigns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  updateCampaign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCampaignDto,
  ) {
    return this.newslettersService.updateCampaign(tenantId, id, dto);
  }

  @Delete('campaigns/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  removeCampaign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.newslettersService.removeCampaign(tenantId, id);
  }

  /**
   * Gönderim tetikleyicisi. SMTP altyapısı henüz yok; dryRun=true default
   * modunda sadece kaç aboneye gideceğini bildirir. dryRun=false çağrısı
   * durum güncellemesi yapar ama posta göndermez (SMTP entegrasyonu ileride
   * bu handler'ın içine BullMQ job'u olarak eklenecek).
   */
  @Post('campaigns/:id/send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  sendCampaign(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() body: { dryRun?: boolean } = {},
  ) {
    return this.newslettersService.sendCampaign(
      tenantId,
      id,
      body.dryRun !== false,
    );
  }
}
