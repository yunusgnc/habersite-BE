import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RedirectsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.redirect.findMany({
      where: { tenantId },
      orderBy: { source: 'asc' },
    });
  }

  async resolve(tenantId: string, source: string) {
    return this.prisma.redirect.findUnique({
      where: { tenantId_source: { tenantId, source } },
    });
  }

  async create(tenantId: string, data: { source: string; target: string; permanent?: boolean }) {
    return this.prisma.redirect.create({
      data: { tenantId, ...data },
    });
  }

  async createMany(tenantId: string, redirects: { source: string; target: string; permanent?: boolean }[]) {
    return this.prisma.redirect.createMany({
      data: redirects.map((r) => ({ tenantId, ...r })),
      skipDuplicates: true,
    });
  }

  async remove(tenantId: string, id: string) {
    return this.prisma.redirect.delete({ where: { id } });
  }
}
