import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(tenantId: string): Promise<Record<string, any>> {
    const settings = await this.prisma.setting.findMany({
      where: { tenantId },
    });

    return settings.reduce(
      (acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      },
      {} as Record<string, any>,
    );
  }

  async get(tenantId: string, key: string): Promise<any> {
    const setting = await this.prisma.setting.findUnique({
      where: {
        tenantId_key: { tenantId, key },
      },
    });

    return setting?.value ?? null;
  }

  async upsert(tenantId: string, key: string, value: any) {
    return this.prisma.setting.upsert({
      where: {
        tenantId_key: { tenantId, key },
      },
      update: { value },
      create: { tenantId, key, value },
    });
  }

  async bulkUpsert(tenantId: string, settings: Record<string, any>) {
    const operations = Object.entries(settings).map(([key, value]) =>
      this.prisma.setting.upsert({
        where: {
          tenantId_key: { tenantId, key },
        },
        update: { value },
        create: { tenantId, key, value },
      }),
    );

    return this.prisma.$transaction(operations);
  }
}
