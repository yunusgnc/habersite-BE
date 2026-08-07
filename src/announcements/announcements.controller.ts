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
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAll(@CurrentTenant() tenantId: string) {
    return this.announcementsService.findAll(tenantId);
  }

  @Get('active')
  @UseGuards(TenantGuard)
  findActive(@CurrentTenant() tenantId: string) {
    return this.announcementsService.findActive(tenantId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.announcementsService.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAnnouncementDto,
  ) {
    return this.announcementsService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.announcementsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('EDITOR')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.announcementsService.remove(tenantId, id);
  }
}
