import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { WidgetsModule } from '../widgets/widgets.module';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';

@Module({
  imports: [PrismaModule, WidgetsModule],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
