import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PersonProfilesController } from './person-profiles.controller';
import { PersonProfilesService } from './person-profiles.service';

@Module({
  imports: [PrismaModule],
  controllers: [PersonProfilesController],
  providers: [PersonProfilesService],
  exports: [PersonProfilesService],
})
export class PersonProfilesModule {}
