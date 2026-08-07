import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/tags')
@UseGuards(TenantGuard)
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  findAll(@CurrentTenant() tenantId: string) {
    return this.tagsService.findAll(tenantId);
  }

  @Get(':id')
  findOne(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.tagsService.findOne(tenantId, id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  create(@CurrentTenant() tenantId: string, @Body() dto: CreateTagDto) {
    return this.tagsService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  update(@CurrentTenant() tenantId: string, @Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.tagsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('EDITOR')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.tagsService.remove(tenantId, id);
  }
}
