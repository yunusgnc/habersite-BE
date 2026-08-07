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
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/create-page.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/pages')
@UseGuards(TenantGuard)
export class PagesController {
  constructor(private pagesService: PagesService) {}

  @Get()
  findPublished(@CurrentTenant() tenantId: string) {
    return this.pagesService.findPublished(tenantId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(@CurrentTenant() tenantId: string) {
    return this.pagesService.findAll(tenantId);
  }

  @Get(':slug')
  findBySlug(@CurrentTenant() tenantId: string, @Param('slug') slug: string) {
    return this.pagesService.findBySlug(tenantId, slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@CurrentTenant() tenantId: string, @Body() dto: CreatePageDto) {
    return this.pagesService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePageDto,
  ) {
    return this.pagesService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.pagesService.remove(tenantId, id);
  }
}
