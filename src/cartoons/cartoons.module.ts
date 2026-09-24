import { Module } from '@nestjs/common';
import { CartoonsController } from './cartoons.controller';
import { CartoonsService } from './cartoons.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [CartoonsController],
  providers: [CartoonsService],
  exports: [CartoonsService],
})
export class CartoonsModule {}
