import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageModule } from '../media/storage/storage.module';
import { WidgetsService } from './widgets.service';
import { WidgetsController } from './widgets.controller';
import { WidgetFeederService } from './widget-feeder.service';

// StorageModule: gazete kapakları dış kaynaktan çekilip kendi bucket'ımıza
// aynalanıyor (bkz. widget-feeder → fetchNewspapers).
@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, StorageModule],
  controllers: [WidgetsController],
  providers: [WidgetsService, WidgetFeederService],
  exports: [WidgetsService, WidgetFeederService],
})
export class WidgetsModule {}
