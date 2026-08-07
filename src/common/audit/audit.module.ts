import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';

/**
 * Global module — every service can inject AuditService without importing.
 * Also exposes GET /api/audit-logs for admins to browse the activity trail.
 */
@Global()
@Module({
  imports: [PrismaModule],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
