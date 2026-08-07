import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { CurrentTenant } from '../decorators/tenant.decorator';
import { TenantGuard } from '../guards/tenant.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/guards/roles.guard';

@Controller('api/audit-logs')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AuditController {
  constructor(private readonly audit: AuditService) {}

  @Get()
  list(
    @CurrentTenant() tenantId: string,
    @Query('entity') entity?: string,
    @Query('entityId') entityId?: string,
    @Query('userId') userId?: string,
    @Query('limit') limit?: string,
  ) {
    return this.audit.list({
      tenantId,
      entity,
      entityId,
      userId,
      limit: limit ? Math.min(200, Number(limit)) : 50,
    });
  }
}
