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
import { NoticeType } from '@prisma/client';
import { OfficialNoticesService } from './official-notices.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/official-notices')
@UseGuards(TenantGuard)
export class OfficialNoticesController {
  constructor(private readonly service: OfficialNoticesService) {}

  // ── Public ──────────────────────────────────────────────────────────

  @Get('public')
  findPublic(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('noticeType') noticeType?: string,
    @Query('institution') institution?: string,
    @Query('search') search?: string,
    @Query('archived') archived?: string,
  ) {
    return this.service.findPublic(tenantId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor,
      noticeType: parseNoticeType(noticeType),
      institution,
      search,
      archived: archived === 'true',
    });
  }

  @Get('public/institutions')
  institutions(@CurrentTenant() tenantId: string) {
    return this.service.institutions(tenantId);
  }

  @Get('public/:slug')
  findBySlug(@CurrentTenant() tenantId: string, @Param('slug') slug: string) {
    return this.service.findBySlug(tenantId, slug);
  }

  // ── Admin ───────────────────────────────────────────────────────────

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('noticeType') noticeType?: string,
    @Query('search') search?: string,
  ) {
    return this.service.findAll(tenantId, {
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor,
      noticeType: parseNoticeType(noticeType),
      search,
    });
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  stats(@CurrentTenant() tenantId: string) {
    return this.service.stats(tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateOfficialNoticeDto) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateOfficialNoticeDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPER_ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }
}

/** Geçersiz değeri 400 yerine "filtre yok" olarak ele al. */
function parseNoticeType(value?: string): NoticeType | undefined {
  if (!value) return undefined;
  return (Object.values(NoticeType) as string[]).includes(value)
    ? (value as NoticeType)
    : undefined;
}
