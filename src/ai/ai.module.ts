import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

// SettingsModule: tenant'ın sağlayıcı tercihi ve şifreli API anahtarı oradan
// okunuyor (`getSecret`).
@Module({
  imports: [SettingsModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
