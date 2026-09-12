import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { IsIn } from 'class-validator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { PAYLASIM_AGLARI } from '../articles/dto/create-article.dto';
import { SocialShareService } from './social-share.service';

class SinamaDto {
  @IsIn(PAYLASIM_AGLARI)
  ag!: string;
}

/**
 * Paylaşım kurulumunu panelden denetlemek için.
 *
 * Paylaşımın kendisi "ateşle ve unut" olduğundan hatalar yalnızca sunucu
 * günlüğüne düşüyor; bu uç aynı kimlik bilgileriyle ağın OKUMA uçlarını
 * çağırıp sorunu kullanıcının okuyabileceği bir cümleye çeviriyor.
 * Hiçbir gönderi atılmaz — kanal/sayfa kirlenmez.
 */
@Controller('api/social-share')
@UseGuards(TenantGuard, JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class SocialShareController {
  constructor(private readonly socialShare: SocialShareService) {}

  @Post('test')
  sina(@CurrentTenant() tenantId: string, @Body() dto: SinamaDto) {
    return this.socialShare.baglantiyiSina(tenantId, dto.ag);
  }
}
