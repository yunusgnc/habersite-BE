import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PrismaModule } from '../prisma/prisma.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { StorageModule } from './storage/storage.module';

@Module({
  imports: [
    PrismaModule,
    StorageModule,
    // Bellekte tut — magic-byte/re-encode adımları için buffer gerekli.
    // Storage adapter'a yazmadan önce sharp ile temizliyoruz.
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        // 20MB — video için gerekirse env üzerinden büyütülür
        fileSize: Number(process.env.MAX_UPLOAD_SIZE || 20 * 1024 * 1024),
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
