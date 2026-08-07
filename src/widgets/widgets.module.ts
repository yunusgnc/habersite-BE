import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { WidgetFeederService } from './widget-feeder.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [WidgetsController],
  providers: [WidgetsService, WidgetFeederService],
  exports: [WidgetsService, WidgetFeederService],
})
export class WidgetsModule {}
