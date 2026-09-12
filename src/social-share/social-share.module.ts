import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { SocialShareController } from './social-share.controller';
import { SocialShareService } from './social-share.service';

@Module({
  imports: [SettingsModule],
  controllers: [SocialShareController],
  providers: [SocialShareService],
  exports: [SocialShareService],
})
export class SocialShareModule {}
