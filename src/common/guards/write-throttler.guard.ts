import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

const SAFE_HTTP_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

/**
 * Genel hız sınırını yalnızca sunucuda durum değiştirebilen isteklere uygular.
 *
 * Site uygulamalarının SSR istekleri API'ye aynı sunucu IP'sinden gelir. Okuma
 * isteklerini IP bazlı ortak kotaya katmak, farklı ziyaretçilerin birbirinin
 * kotasını tüketmesine ve haber detaylarının geçici olarak açılamamasına yol
 * açar. Yazma istekleri ve bunların endpoint bazlı @Throttle sınırları korunur.
 */
@Injectable()
export class WriteThrottlerGuard extends ThrottlerGuard {
  protected async shouldSkip(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{ method?: string }>();
    const method = request.method?.toUpperCase() ?? '';

    return SAFE_HTTP_METHODS.has(method);
  }
}
