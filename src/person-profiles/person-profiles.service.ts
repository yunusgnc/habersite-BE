import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePersonProfileDto } from './dto/create-person-profile.dto';
import { UpdatePersonProfileDto } from './dto/update-person-profile.dto';

@Injectable()
export class PersonProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, options: { cursor?: string; limit?: number; search?: string } = {}) {
    const take = (options.limit || 20) + 1;
    const where: any = { tenantId };

    if (options.search) {
      where.name = { contains: options.search, mode: 'insensitive' };
    }

    const items = await this.prisma.personProfile.findMany({
      where,
      take,
      ...(options.cursor && {
        skip: 1,
        cursor: { id: options.cursor },
      }),
      // id tiebreaker: createdAt unique degil, cursor pagination deterministik siralama ister.
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
    });

    const hasMore = items.length === take;
    if (hasMore) items.pop();

    return {
      items,
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
      hasMore,
    };
  }

  async findOne(tenantId: string, id: string) {
    const profile = await this.prisma.personProfile.findFirst({
      where: { id, tenantId },
    });

    if (!profile) {
      throw new NotFoundException('Person profile not found');
    }

    return profile;
  }

  async findBySlug(tenantId: string, slug: string) {
    const profile = await this.prisma.personProfile.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (!profile) {
      throw new NotFoundException('Person profile not found');
    }

    return profile;
  }

  async create(tenantId: string, dto: CreatePersonProfileDto) {
    const slug = await this.generateUniqueSlug(tenantId, dto.name);

    return this.prisma.personProfile.create({
      data: {
        tenantId,
        slug,
        name: dto.name,
        bio: dto.bio,
        image: dto.image,
        birthDate: dto.birthDate,
        title: dto.title,
        social: dto.social ?? {},
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdatePersonProfileDto) {
    await this.ensureExists(tenantId, id);

    const data: Record<string, any> = { ...dto };

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
    }

    return this.prisma.personProfile.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    return this.prisma.personProfile.delete({ where: { id } });
  }

  private async ensureExists(tenantId: string, id: string) {
    const profile = await this.prisma.personProfile.findFirst({
      where: { id, tenantId },
    });

    if (!profile) {
      throw new NotFoundException('Person profile not found');
    }

    return profile;
  }

  private async generateUniqueSlug(
    tenantId: string,
    name: string,
    excludeId?: string,
  ): Promise<string> {
    let slug = slugify(name, { lower: true, strict: true, locale: 'tr' });
    let suffix = 0;
    let candidate = slug;

    while (true) {
      const existing = await this.prisma.personProfile.findUnique({
        where: { tenantId_slug: { tenantId, slug: candidate } },
      });

      if (!existing || existing.id === excludeId) {
        return candidate;
      }

      suffix++;
      candidate = `${slug}-${suffix}`;
    }
  }
}
