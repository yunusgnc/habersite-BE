import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { RssImportService } from './rss-import.service';
import { RssImportController } from './rss-import.controller';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  controllers: [RssImportController],
  providers: [RssImportService],
  exports: [RssImportService],
})
export class RssImportModule {}
