import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { CreateAdDto } from './dto/create-ad.dto';
import { UpdateAdDto } from './dto/update-ad.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { AdPosition } from '@prisma/client';

@Controller('api/ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('position/:position')
  @UseGuards(TenantGuard)
  findByPosition(
    @CurrentTenant() tenantId: string,
    @Param('position') position: AdPosition,
  ) {
    return this.adsService.findByPosition(tenantId, position);
  }

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(@CurrentTenant() tenantId: string) {
    return this.adsService.findAll(tenantId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateAdDto) {
    return this.adsService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
  ) {
    return this.adsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.adsService.remove(tenantId, id);
  }

  @Post(':id/impression')
  @UseGuards(TenantGuard)
  trackImpression(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.adsService.trackImpression(tenantId, id);
  }

  @Post(':id/click')
  @UseGuards(TenantGuard)
  trackClick(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.adsService.trackClick(tenantId, id);
  }
}
