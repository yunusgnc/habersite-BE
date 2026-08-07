import { Module } from '@nestjs/common';
import { BreakingNewsService } from './breaking-news.service';
import { BreakingNewsController } from './breaking-news.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BreakingNewsController],
  providers: [BreakingNewsService],
})
export class BreakingNewsModule {}
