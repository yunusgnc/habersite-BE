import { Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { ArticleStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { CreateGalleryDto, CreateGalleryImageDto } from './dto/create-gallery.dto';
import type { UpdateGalleryDto } from './dto/update-gallery.dto';
import type { QueryGalleriesDto } from './dto/query-galleries.dto';

@Injectable()
export class GalleriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: QueryGalleriesDto) {
    const { cursor, limit = 20, status, search } = query;

    const where: Prisma.GalleryWhereInput = { tenantId };

    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    const items = await this.prisma.gallery.findMany({
      where,
      // id tiebreaker: createdAt unique degil, cursor pagination deterministik siralama ister.
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        _count: { select: { images: true } },
      },
    });

    let nextCursor: string | undefined;
    if (items.length > limit) {
      const next = items.pop();
      nextCursor = next!.id;
    }

    return { items, nextCursor };
  }

  async findOne(tenantId: string, id: string) {
    const gallery = await this.prisma.gallery.findFirst({
      where: { id, tenantId },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery not found');
    }

    return gallery;
  }

  async findBySlug(tenantId: string, slug: string) {
    const gallery = await this.prisma.gallery.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!gallery) {
      throw new NotFoundException('Gallery not found');
    }

    return gallery;
  }

  async create(tenantId: string, dto: CreateGalleryDto) {
    const { images, publishedAt: publishedAtStr, slug: slugInput, ...data } = dto;

    const slug = await this.generateUniqueSlug(
      tenantId,
      slugInput?.trim() || data.title,
    );

    const publishedAt =
      data.status === ArticleStatus.PUBLISHED && !publishedAtStr
        ? new Date()
        : publishedAtStr
          ? new Date(publishedAtStr)
          : undefined;

    const gallery = await this.prisma.gallery.create({
      data: {
        ...data,
        tenantId,
        slug,
        publishedAt,
        images: images?.length
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                caption: img.caption,
                credit: img.credit,
                alt: img.alt,
                sortOrder: img.sortOrder ?? index,
              })),
            }
          : undefined,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });

    return gallery;
  }

  async update(tenantId: string, id: string, dto: UpdateGalleryDto) {
    const existing = await this.findOne(tenantId, id);
    const { publishedAt: publishedAtStr, ...rest } = dto;

    const updateData: Record<string, any> = { ...rest };

    const publishedAt = publishedAtStr ? new Date(publishedAtStr) : undefined;

    if (
      rest.status === ArticleStatus.PUBLISHED &&
      existing.status !== ArticleStatus.PUBLISHED &&
      !publishedAt &&
      !existing.publishedAt
    ) {
      updateData.publishedAt = new Date();
    } else if (publishedAt) {
      updateData.publishedAt = publishedAt;
    }

    return this.prisma.gallery.update({
      where: { id },
      data: updateData,
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return this.prisma.gallery.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
    });
  }

  async addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]) {
    await this.findOne(tenantId, galleryId);

    const lastImage = await this.prisma.galleryImage.findFirst({
      where: { galleryId },
      orderBy: { sortOrder: 'desc' },
    });

    const startOrder = (lastImage?.sortOrder ?? -1) + 1;

    return this.prisma.galleryImage.createMany({
      data: images.map((img, index) => ({
        galleryId,
        url: img.url,
        caption: img.caption,
        credit: img.credit,
        alt: img.alt,
        sortOrder: img.sortOrder ?? startOrder + index,
      })),
    });
  }

  async removeImage(tenantId: string, imageId: string) {
    const image = await this.prisma.galleryImage.findUnique({
      where: { id: imageId },
      include: { gallery: { select: { tenantId: true } } },
    });

    if (!image || image.gallery.tenantId !== tenantId) {
      throw new NotFoundException('Gallery image not found');
    }

    return this.prisma.galleryImage.delete({
      where: { id: imageId },
    });
  }

  async reorderImages(tenantId: string, galleryId: string, imageIds: string[]) {
    await this.findOne(tenantId, galleryId);

    const updates = imageIds.map((id, index) =>
      this.prisma.galleryImage.update({
        where: { id },
        data: { sortOrder: index },
      }),
    );

    return this.prisma.$transaction(updates);
  }

  private async generateUniqueSlug(
    tenantId: string,
    title: string,
  ): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true, locale: 'tr' });

    const existing = await this.prisma.gallery.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return slug;
  }
}
