import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(TenantGuard)
  findAll(@CurrentTenant() tenantId: string) {
    return this.categoriesService.findAll(tenantId);
  }

  @Get(':slug')
  @UseGuards(TenantGuard)
  findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.categoriesService.findBySlug(tenantId, slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(tenantId, dto);
  }

  /**
   * SIRA ÖNEMLİ: `:id` rotasından ÖNCE olmak zorunda.
   *
   * Dosyanın en altındaydı ve Express rotaları bildirim sırasına göre
   * eşleştirdiği için `PATCH /categories/reorder` isteği buraya hiç
   * ulaşmıyordu: "reorder" bir kategori kimliği sanılıyor, gövde doğrulamaya
   * takılıp 400 dönüyordu. Kategorilerde sürükle-bırak sıralama fiilen hiç
   * çalışmamıştı — kullanıcı kartları sürüklüyor, sayfayı yenileyince eski
   * sıra geri geliyordu.
   */
  @Patch('reorder')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  reorder(
    @CurrentTenant() tenantId: string,
    @Body() dto: { items: { id: string; sortOrder: number }[] },
  ) {
    return this.categoriesService.reorder(tenantId, dto.items);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('EDITOR')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.categoriesService.remove(tenantId, id);
  }

}
