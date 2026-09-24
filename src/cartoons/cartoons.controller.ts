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
import { CartoonsService } from './cartoons.service';
import { CreateCartoonDto } from './dto/create-cartoon.dto';
import { UpdateCartoonDto } from './dto/update-cartoon.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/cartoons')
@UseGuards(TenantGuard)
export class CartoonsController {
  constructor(private readonly service: CartoonsService) {}

  // ── Public ──────────────────────────────────────────────────────────
  // Sabit yollar ':id' / ':slug' parametrelerinden ÖNCE tanımlı olmak
  // zorunda; aksi halde '/cartoons/stats' bir id gibi eşleşiyor.

  @Get('public')
  findPublic(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('page') page?: string,
    @Query('artist') artist?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findPublic(tenantId, {
      limit: sayi(limit),
      cursor,
      page: sayi(page),
      artist,
      search,
    });
  }

  @Get('public/artists')
  artists(@CurrentTenant() tenantId: string) {
    return this.service.artists(tenantId);
  }

  @Get('public/sitemap')
  sitemap(@CurrentTenant() tenantId: string) {
    return this.service.sitemap(tenantId);
  }

  @Get('public/:slug')
  findBySlug(@CurrentTenant() tenantId: string, @Param('slug') slug: string) {
    return this.service.findBySlug(tenantId, slug);
  }

  @Get('public/:slug/neighbours')
  neighbours(@CurrentTenant() tenantId: string, @Param('slug') slug: string) {
    return this.service.neighbours(tenantId, slug);
  }

  // ── Admin ───────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER')
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(tenantId, { limit: sayi(limit), cursor, search });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER')
  stats(@CurrentTenant() tenantId: string) {
    return this.service.stats(tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER')
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER')
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateCartoonDto) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCartoonDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}

/** Geçersiz sayıyı 400 yerine "değer verilmedi" olarak ele al. */
function sayi(value?: string): number | undefined {
  if (!value) return undefined;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : undefined;
}
