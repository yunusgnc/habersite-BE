import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('api/authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  @UseGuards(TenantGuard)
  findAll(@CurrentTenant() tenantId: string) {
    return this.authorsService.findAll(tenantId);
  }

  // Köşe Yazarları vitrini — ':slug' rotasından ÖNCE tanımlı olmalı,
  // aksi halde "with-latest" bir yazar slug'ı sanılır.
  @Get('with-latest')
  @UseGuards(TenantGuard)
  findWithLatest(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
  ) {
    return this.authorsService.findWithLatest(
      tenantId,
      limit ? parseInt(limit, 10) : undefined,
    );
  }

  @Get(':slug')
  @UseGuards(TenantGuard)
  findBySlug(
    @CurrentTenant() tenantId: string,
    @Param('slug') slug: string,
  ) {
    return this.authorsService.findBySlug(tenantId, slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAuthorDto,
  ) {
    return this.authorsService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAuthorDto,
  ) {
    return this.authorsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('EDITOR')
  remove(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
  ) {
    return this.authorsService.remove(tenantId, id);
  }
}
