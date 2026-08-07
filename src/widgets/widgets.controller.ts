import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { WidgetsService } from './widgets.service';
import { WidgetFeederService } from './widget-feeder.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/widgets')
@UseGuards(TenantGuard)
export class WidgetsController {
  constructor(
    private widgetsService: WidgetsService,
    private feeder: WidgetFeederService,
  ) {}

  @Post(':type/refresh')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  refresh(@CurrentTenant() tenantId: string, @Param('type') type: string) {
    return this.feeder.refreshOne(tenantId, type);
  }

  @Get()
  findActive(@CurrentTenant() tenantId: string) {
    return this.widgetsService.findActive(tenantId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  findAll(@CurrentTenant() tenantId: string) {
    return this.widgetsService.findAll(tenantId);
  }

  @Get(':type')
  findByType(@CurrentTenant() tenantId: string, @Param('type') type: string) {
    return this.widgetsService.findByType(tenantId, type);
  }

  @Put(':type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  upsert(
    @CurrentTenant() tenantId: string,
    @Param('type') type: string,
    @Body() data: { config?: any; active?: boolean; sortOrder?: number },
  ) {
    return this.widgetsService.upsert(tenantId, type, data);
  }

  @Delete(':type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@CurrentTenant() tenantId: string, @Param('type') type: string) {
    return this.widgetsService.remove(tenantId, type);
  }
}
