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
import { BreakingNewsService } from './breaking-news.service';
import { CreateBreakingNewsDto } from './dto/create-breaking-news.dto';
import { UpdateBreakingNewsDto } from './dto/update-breaking-news.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/breaking-news')
export class BreakingNewsController {
  constructor(private readonly breakingNewsService: BreakingNewsService) {}

  @Get()
  @UseGuards(TenantGuard)
  findActive(@CurrentTenant() tenantId: string) {
    return this.breakingNewsService.findActive(tenantId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  findAll(@CurrentTenant() tenantId: string) {
    return this.breakingNewsService.findAll(tenantId);
  }

  @Post('reorder')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  reorder(
    @CurrentTenant() tenantId: string,
    @Body() body: { ids: string[] },
  ) {
    return this.breakingNewsService.reorder(tenantId, body.ids ?? []);
  }

  @Post()
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateBreakingNewsDto,
  ) {
    return this.breakingNewsService.create(tenantId, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('ADMIN', 'EDITOR')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateBreakingNewsDto,
  ) {
    return this.breakingNewsService.update(tenantId, id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TenantGuard, RolesGuard)
  @Roles('EDITOR')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.breakingNewsService.remove(tenantId, id);
  }
}
