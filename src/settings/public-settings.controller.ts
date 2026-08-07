import { Controller, Get, UseGuards } from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { SettingsService } from './settings.service';

const SENSITIVE_KEYS = ['oneSignalAppId', 'appStoreUrl', 'playStoreUrl'];

@Controller('api/public/settings')
@UseGuards(TenantGuard)
export class PublicSettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async getPublic(@CurrentTenant() tenantId: string) {
    const all = await this.settingsService.getAll(tenantId);
    for (const key of SENSITIVE_KEYS) {
      delete all[key];
    }
    return all;
  }
}
