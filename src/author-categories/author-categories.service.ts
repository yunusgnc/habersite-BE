import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorCategoryDto } from './dto/create-author-category.dto';
import { UpdateAuthorCategoryDto } from './dto/update-author-category.dto';
import slugify from 'slugify';

@Injectable()
export class AuthorCategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.authorCategory.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const authorCategory = await this.prisma.authorCategory.findFirst({
      where: { id, tenantId },
    });
    if (!authorCategory) {
      throw new NotFoundException('Author category not found');
    }
    return authorCategory;
  }

  async create(tenantId: string, dto: CreateAuthorCategoryDto) {
    const slug = await this.generateUniqueSlug(tenantId, dto.name);
    return this.prisma.authorCategory.create({
      data: {
        tenantId,
        name: dto.name,
        slug,
        sortOrder: dto.sortOrder ?? 0,
        active: dto.active ?? true,
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateAuthorCategoryDto) {
    await this.ensureExists(tenantId, id);

    const data: any = { ...dto };

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
    }

    return this.prisma.authorCategory.update({
      where: { id },
      data,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    return this.prisma.authorCategory.delete({
      where: { id },
    });
  }

  async reorder(tenantId: string, items: { id: string; sortOrder: number }[]) {
    return this.prisma.$transaction(
      items.map((item) =>
        this.prisma.authorCategory.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        }),
      ),
    );
  }

  private async ensureExists(tenantId: string, id: string) {
    const authorCategory = await this.prisma.authorCategory.findFirst({
      where: { id, tenantId },
    });
    if (!authorCategory) {
      throw new NotFoundException('Author category not found');
    }
    return authorCategory;
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
      const existing = await this.prisma.authorCategory.findUnique({
        where: { tenantId_slug: { tenantId, slug: candidate } },
      });
      if (!existing || existing.id === excludeId) return candidate;
      suffix++;
      candidate = `${slug}-${suffix}`;
    }
  }
}
