import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.author.create({
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
  }

  async update(tenantId: string, id: string, dto: UpdateAuthorDto) {
    await this.ensureExists(tenantId, id);

    const data: Record<string, any> = { ...dto };

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
    }

    return this.prisma.author.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    return this.prisma.author.delete({ where: { id } });
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
