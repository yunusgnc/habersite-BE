import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Backend'den tenant'ın public site'ına revalidate webhook'u atar.
 * Fire-and-forget — request tamamlanana kadar admin write'ı bekletmez.
 *
 * Multi-tenant: her mutation için ilgili tenant'ın `domain` alanına bakılır,
 * o domain'in `/api/revalidate` endpoint'ine tag'ler POST edilir.
 * `DEFAULT_FRONTEND_URL` set edilirse (dev için), domain'i olmayan
 * tenant'lar buraya düşer.
 */
@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);
  private readonly secret = process.env.REVALIDATE_SECRET;
  private readonly defaultUrl = process.env.DEFAULT_FRONTEND_URL;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Async fire-and-forget. Hata olursa log'lanır, atılmaz.
   */
  revalidateTenant(tenantId: string, tags: readonly string[]): void {
    if (tags.length === 0) return;
    // Bekletmeden başlat
    void this.dispatch(tenantId, tags);
  }

  private async dispatch(tenantId: string, tags: readonly string[]): Promise<void> {
    try {
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { domain: true, active: true },
      });
      if (!tenant || !tenant.active) return;

      const base = this.resolveBaseUrl(tenant.domain);
      if (!base) return;

      const url = new URL('/api/revalidate', base);
      tags.forEach((t) => url.searchParams.append('tag', t));

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 3000);

      try {
        const res = await fetch(url.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(this.secret ? { 'x-revalidate-secret': this.secret } : {}),
          },
          signal: controller.signal,
        });
        if (!res.ok) {
          this.logger.warn(
            `Revalidate ${url.host} → HTTP ${res.status} tags=[${tags.join(',')}]`,
          );
        }
      } finally {
        clearTimeout(timer);
      }
    } catch (err) {
      this.logger.warn(
        `Revalidate failed tenant=${tenantId} tags=[${tags.join(',')}]: ${(err as Error).message}`,
      );
    }
  }

  private resolveBaseUrl(domain: string | null): string | null {
    if (domain && domain.trim()) {
      const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
      return `https://${clean}`;
    }
    return this.defaultUrl?.trim() || null;
  }
}
