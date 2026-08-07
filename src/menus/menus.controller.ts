import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/menus')
@UseGuards(TenantGuard)
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.menusService.findAll(tenantId);
  }

  @Get(':location')
  findByLocation(@CurrentTenant() tenantId: string, @Param('location') location: string) {
    return this.menusService.findByLocation(tenantId, location);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  upsert(@CurrentTenant() tenantId: string, @Body() dto: CreateMenuDto) {
    return this.menusService.upsert(tenantId, dto);
  }

  @Patch(':location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  update(@CurrentTenant() tenantId: string, @Param('location') location: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(tenantId, location, dto);
  }

  @Delete(':location')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('location') location: string) {
    return this.menusService.remove(tenantId, location);
  }
}
