import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { VideoUploadService } from './video-upload.service';
import { VideosController } from './videos.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VideosController],
  providers: [VideosService, VideoUploadService],
  exports: [VideosService],
})
export class VideosModule {}
