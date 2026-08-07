import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';

@Controller('api/audit-log')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditLogController {
  constructor(private auditLogService: AuditLogService) {}

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('entity') entity?: string,
  ) {
    return this.auditLogService.findAll(tenantId, {
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
      entity,
    });
  }
}
