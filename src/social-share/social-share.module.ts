import { Module } from '@nestjs/common';
import { SettingsModule } from '../settings/settings.module';
import { SocialShareService } from './social-share.service';

@Module({
  imports: [SettingsModule],
  providers: [SocialShareService],
  exports: [SocialShareService],
})
export class SocialShareModule {}
