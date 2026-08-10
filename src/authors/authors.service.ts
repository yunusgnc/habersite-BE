import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findAll(tenantId: string) {
    return this.prisma.author.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlug(tenantId: string, slug: string) {
    const author = await this.prisma.author.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
  }

  async create(tenantId: string, dto: CreateAuthorDto) {
    const slug = await this.generateUniqueSlug(tenantId, dto.name);

    const result = await this.prisma.author.create({
      data: {
        tenantId,
        slug,
        name: dto.name,
        bio: dto.bio,
        avatar: dto.avatar,
        email: dto.email,
        social: dto.social ?? {},
        active: dto.active ?? true,
        sortOrder: dto.sortOrder ?? 0,
      },
    });
    this.revalidation.revalidateTenant(tenantId, ['authors']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdateAuthorDto) {
    await this.ensureExists(tenantId, id);

    const data: Record<string, any> = { ...dto };

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
    }

    const result = await this.prisma.author.update({
      where: { id },
      data,
    });
    this.revalidation.revalidateTenant(tenantId, ['authors']);
    return result;
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    const result = await this.prisma.author.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['authors']);
    return result;
  }

  private async ensureExists(tenantId: string, id: string) {
    const author = await this.prisma.author.findFirst({
      where: { id, tenantId },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    return author;
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
      const existing = await this.prisma.author.findUnique({
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
