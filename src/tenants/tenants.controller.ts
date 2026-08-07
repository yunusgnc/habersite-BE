import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/create-tenant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';

@Controller('api/tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tenantsService.findById(id);
  }

  @Post()
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTenantDto) {
    return this.tenantsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  // Convenience endpoint'ler — dashboard toggle'ları için.
  @Patch(':id/suspend')
  suspend(@Param('id') id: string) {
    return this.tenantsService.update(id, { active: false } as any);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.tenantsService.update(id, { active: true } as any);
  }

  /**
   * KVKK/GDPR — tenant'a ait tüm veriyi JSON olarak dışa aktar.
   * Kullanıcı listesi, haberler, yorumlar, medya, ayarlar, log'lar.
   */
  @Get(':id/export')
  export(@Param('id') id: string) {
    return this.tenantsService.exportAll(id);
  }
}
