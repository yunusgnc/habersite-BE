import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NewslettersService } from './newsletters.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/newsletters')
@UseGuards(TenantGuard)
export class NewslettersController {
  constructor(private newslettersService: NewslettersService) {}

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
}
