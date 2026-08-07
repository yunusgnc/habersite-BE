import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto } from './dto/create-tenant.dto';
import slugify from 'slugify';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id } });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return tenant;
  }

  async findByDomain(domain: string) {
    return this.prisma.tenant.findFirst({
      where: {
        OR: [{ domain }, { subdomain: domain.split('.')[0] }],
        active: true,
      },
    });
  }

  async create(dto: CreateTenantDto) {
    const slug = slugify(dto.name, { lower: true, strict: true, locale: 'tr' });
    return this.prisma.tenant.create({
      data: { ...dto, slug },
    });
  }

  async update(id: string, dto: UpdateTenantDto) {
    await this.findById(id);
    return this.prisma.tenant.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.tenant.update({
      where: { id },
      data: { active: false },
    });
  }

  /**
   * KVKK/GDPR — tenant'a ait tüm veriyi tek bir JSON dokümanı olarak dışa
   * aktar. Büyük tenant'larda bellek riski var; ileride streaming'e alınabilir.
   */
  async exportAll(id: string) {
    const tenant = await this.findById(id);
    const [
      users,
      articles,
      categories,
      tags,
      authors,
      media,
      comments,
      settings,
      menus,
      pages,
      redirects,
      auditLogs,
    ] = await Promise.all([
      this.prisma.user.findMany({ where: { tenantId: id } }),
      this.prisma.article.findMany({
        where: { tenantId: id },
        include: {
          categories: true,
          tags: true,
        },
      }),
      this.prisma.category.findMany({ where: { tenantId: id } }),
      this.prisma.tag.findMany({ where: { tenantId: id } }),
      this.prisma.author.findMany({ where: { tenantId: id } }),
      this.prisma.media.findMany({ where: { tenantId: id } }),
      this.prisma.comment.findMany({ where: { tenantId: id } }),
      this.prisma.setting.findMany({ where: { tenantId: id } }),
      this.prisma.menu.findMany({ where: { tenantId: id } }),
      this.prisma.page.findMany({ where: { tenantId: id } }),
      this.prisma.redirect.findMany({ where: { tenantId: id } }),
      this.prisma.auditLog.findMany({
        where: { tenantId: id },
        take: 10_000,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      version: 1,
      tenant,
      users,
      articles,
      categories,
      tags,
      authors,
      media,
      comments,
      settings,
      menus,
      pages,
      redirects,
      auditLogs,
    };
  }
}
