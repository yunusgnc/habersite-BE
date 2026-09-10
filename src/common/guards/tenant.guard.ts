import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { normalizeTenantHost, tenantDomainCandidates } from '../tenant-domain';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request = ctx.switchToHttp().getRequest();

    // Çözüm sırası: x-tenant-id → x-tenant-domain → Host header domain lookup
    const tenantId = request.headers['x-tenant-id'] as string | undefined;
    const tenantDomain = request.headers['x-tenant-domain'] as string | undefined;
    const host = request.headers['host'] as string | undefined;

    let tenant: any = null;

    if (tenantId) {
      tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
      });
    } else if (tenantDomain) {
      const domain = normalizeTenantHost(tenantDomain);
      const domains = tenantDomainCandidates(domain);
      tenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [
            { domain: { in: domains } },
            { subdomain: domain.split('.')[0] },
            { slug: domain },
          ],
        },
      });
    } else if (host) {
      const domain = normalizeTenantHost(host);
      const domains = tenantDomainCandidates(domain);
      tenant = await this.prisma.tenant.findFirst({
        where: {
          OR: [
            { domain: { in: domains } },
            { subdomain: domain.split('.')[0] },
          ],
        },
      });
    }

    if (!tenant) {
      throw new UnauthorizedException('Tenant not found');
    }

    if (!tenant.active) {
      throw new UnauthorizedException('Tenant is not active');
    }

    request.tenant = tenant;
    return true;
  }
}
