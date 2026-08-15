import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { CurrentTenant } from '../common/decorators/tenant.decorator';
import { AiService } from './ai.service';
import { AssistDto } from './dto/assist.dto';

/**
 * Haber formundaki yapay zekâ yardımcıları.
 *
 * API anahtarı sunucuda kalıyor — tarayıcıya hiç inmiyor. Panel yalnızca
 * "şu haber için spot yaz" diyor, sağlayıcıyla konuşan taraf burası.
 *
 * Oran sınırı normalden sıkı (dakikada 20): her çağrı müşterinin kendi
 * hesabından para harcıyor, sekmeyi açık unutan bir kullanıcı ya da kaçak bir
 * döngü fatura üretmesin.
 */
@Controller('api/ai')
@UseGuards(TenantGuard, JwtAuthGuard)
@Throttle({ default: { limit: 20, ttl: 60_000 } })
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('assist')
  assist(@CurrentTenant() tenantId: string, @Body() dto: AssistDto) {
    return this.ai.assist(tenantId, dto.task, {
      title: dto.title,
      content: dto.content,
      spot: dto.spot,
    });
  }
}
