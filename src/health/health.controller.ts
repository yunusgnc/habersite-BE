import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  /** Basit liveness — process ayakta mı. Load balancer için. */
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /** Readiness — DB'ye ulaşabiliyor mu. Deploy pipeline'ı için. */
  @Get('ready')
  async ready() {
    const checks: Record<string, { ok: boolean; error?: string; latency?: number }> = {};

    const dbStart = Date.now();
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = { ok: true, latency: Date.now() - dbStart };
    } catch (err) {
      checks.database = { ok: false, error: (err as Error).message };
    }

    const allOk = Object.values(checks).every((c) => c.ok);
    return {
      status: allOk ? 'ready' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    };
  }
}
