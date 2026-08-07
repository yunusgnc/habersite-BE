import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { RedirectsService } from './redirects.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/redirects')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RedirectsController {
  constructor(private redirectsService: RedirectsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.redirectsService.findAll(tenantId);
  }

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Body() data: { source: string; target: string; permanent?: boolean },
  ) {
    return this.redirectsService.create(tenantId, data);
  }

  @Post('bulk')
  @Roles('ADMIN')
  createMany(
    @CurrentTenant() tenantId: string,
    @Body() data: { redirects: { source: string; target: string; permanent?: boolean }[] },
  ) {
    return this.redirectsService.createMany(tenantId, data.redirects);
  }

  @Delete(':id')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.redirectsService.remove(tenantId, id);
  }
}
