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
import { RssImportService } from './rss-import.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import {
  CreateRssSourceDto,
  UpdateRssSourceDto,
} from './dto/rss-source.dto';

@Controller('api/rss-sources')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class RssImportController {
  constructor(private readonly service: RssImportService) {}

  @Get()
  list(@CurrentTenant() tenantId: string) {
    return this.service.list(tenantId);
  }

  @Get(':id')
  get(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.get(tenantId, id);
  }

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateRssSourceDto,
  ) {
    return this.service.create(tenantId, dto);
  }

  @Patch(':id')
  update(
    @CurrentTenant() tenantId: string,
    @Param('id') id: string,
    @Body() dto: UpdateRssSourceDto,
  ) {
    return this.service.update(tenantId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.remove(tenantId, id);
  }

  /** Manuel tetikleyici — cron'u beklemeden hemen çek */
  @Post(':id/fetch')
  fetch(@CurrentTenant() tenantId: string, @Param('id') id: string) {
    return this.service.fetchOne(tenantId, id);
  }
}
