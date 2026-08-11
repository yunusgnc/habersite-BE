import { Module } from '@nestjs/common';
import { OfficialNoticesController } from './official-notices.controller';
import { OfficialNoticesService } from './official-notices.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OfficialNoticesController],
  providers: [OfficialNoticesService],
  exports: [OfficialNoticesService],
})
export class OfficialNoticesModule {}
