import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService, private readonly revalidation: RevalidationService) {}

  async findAll(tenantId: string) {
    const categories = await this.prisma.category.findMany({
      where: { tenantId },
      include: { children: true },
      orderBy: { sortOrder: 'asc' },
    });

    // Build tree: return only root categories with nested children
    const rootCategories = categories
      .filter((c) => !c.parentId)
      .map((parent) => ({
        ...parent,
        children: categories.filter((c) => c.parentId === parent.id),
      }));

    return rootCategories;
  }

  async findBySlug(tenantId: string, slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: { children: true, parent: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(tenantId: string, dto: CreateCategoryDto) {
    const slug = await this.generateUniqueSlug(tenantId, dto.name);

    const result = await this.prisma.category.create({
      data: {
        tenantId,
        slug,
        name: dto.name,
        parentId: dto.parentId,
        description: dto.description,
        image: dto.image,
        color: dto.color,
        sortOrder: dto.sortOrder ?? 0,
        seoTitle: dto.seoTitle,
        seoDesc: dto.seoDesc,
      },
      include: { children: true },
    });
    this.revalidation.revalidateTenant(tenantId, ['categories']);
    return result;
  }

  async update(tenantId: string, id: string, dto: UpdateCategoryDto) {
    await this.ensureExists(tenantId, id);

    const data: Record<string, any> = { ...dto };

    if (dto.name) {
      data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
    }

    const result = await this.prisma.category.update({
      where: { id },
      data,
      include: { children: true },
    });
    this.revalidation.revalidateTenant(tenantId, ['categories']);
    return result;
  }

  async remove(tenantId: string, id: string) {
    await this.ensureExists(tenantId, id);
    const result = await this.prisma.category.delete({ where: { id } });
    this.revalidation.revalidateTenant(tenantId, ['categories']);
    return result;
  }

  async reorder(tenantId: string, items: { id: string; sortOrder: number }[]) {
    const updates = items.map((item) =>
      this.prisma.category.updateMany({
        where: { id: item.id, tenantId },
        data: { sortOrder: item.sortOrder },
      }),
    );
    const result = await this.prisma.$transaction(updates);
    this.revalidation.revalidateTenant(tenantId, ['categories']);
    return result;
  }

  private async ensureExists(tenantId: string, id: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, tenantId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
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
      const existing = await this.prisma.category.findUnique({
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
