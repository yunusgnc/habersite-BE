import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { SuperAdminService } from './super-admin.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ResetAdminPasswordDto, UpdateTenantDto } from './dto/update-tenant.dto';

/**
 * Platform yönetimi — yalnızca SUPER_ADMIN.
 * Tenant'lar arası çalıştığı için TenantGuard KULLANILMAZ;
 * yetki tamamen JWT içindeki role üzerinden doğrulanır.
 */
@Controller('api/super')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  @Get('overview')
  overview() {
    return this.service.overview();
  }

  @Get('tenants')
  findAll() {
    return this.service.findAll();
  }

  @Get('tenants/:id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('tenants')
  create(@Body() dto: CreateTenantDto) {
    return this.service.create(dto);
  }

  @Patch('tenants/:id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.service.update(id, dto);
  }

  @Delete('tenants/:id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(id, req.user?.tenantId);
  }

  @Post('tenants/:id/reset-password')
  resetPassword(@Param('id') id: string, @Body() dto: ResetAdminPasswordDto) {
    return this.service.resetAdminPassword(id, dto);
  }
}
