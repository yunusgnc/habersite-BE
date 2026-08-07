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
import { AuthorCategoriesService } from './author-categories.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/author-categories')
export class AuthorCategoriesController {
  constructor(
    private readonly authorCategoriesService: AuthorCategoriesService,
  ) {}

  @Get()
  @UseGuards(TenantGuard)
  findAll(@CurrentTenant() tenantId: string) {
    return this.authorCategoriesService.findAll(tenantId);
  }

  @Get(':id')
  @UseGuards(TenantGuard)
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.authorCategoriesService.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAuthorCategoryDto,
  ) {
    return this.authorCategoriesService.create(tenantId, dto);
  }

  @Patch('reorder')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  reorder(
    @CurrentTenant() tenantId: string,
    @Body() body: { items: { id: string; sortOrder: number }[] },
  ) {
    return this.authorCategoriesService.reorder(tenantId, body.items);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAuthorCategoryDto,
  ) {
    return this.authorCategoriesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.authorCategoriesService.remove(tenantId, id);
  }
}
