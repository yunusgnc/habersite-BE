import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '../prisma/prisma.service';
import { sayfaliListe } from '../common/pagination/sayfali-liste';
import { ArticleStatus } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import type { CreateVideoDto } from './dto/create-video.dto';
import type { UpdateVideoDto } from './dto/update-video.dto';
import type { QueryVideosDto } from './dto/query-videos.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(tenantId: string, query: QueryVideosDto) {
    const { cursor, page, limit = 20, status, search } = query;

    const where: Prisma.VideoWhereInput = { tenantId };

    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: 'insensitive' };

    return sayfaliListe({
      limit,
      page,
      cursor,
      say: () => this.prisma.video.count({ where }),
      bul: (args) =>
        this.prisma.video.findMany({
          where,
          // id tiebreaker: createdAt unique degil, deterministik siralama sart.
          orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
          ...args,
        }),
    });
  }

  async findOne(tenantId: string, id: string) {
    const video = await this.prisma.video.findFirst({
      where: { id, tenantId },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async findBySlug(tenantId: string, slug: string) {
    const video = await this.prisma.video.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (!video) {
      throw new NotFoundException('Video not found');
    }

    return video;
  }

  async create(tenantId: string, dto: CreateVideoDto) {
    const { publishedAt: publishedAtStr, slug: slugInput, ...data } = dto;

    if (!data.videoUrl && !data.embedCode) {
      throw new BadRequestException(
        'Video kaynağı gerekli: bir video yükleyin veya embed kodu ekleyin.',
      );
    }

    // videoUrl is required by schema — mirror embed marker so we always have a value.
    const videoUrl = data.videoUrl || 'embed:custom';

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

    return this.prisma.video.create({
      data: {
        ...data,
        videoUrl,
        tenantId,
        slug,
        publishedAt,
        source: data.source ?? (data.embedCode ? 'embed' : 'upload'),
      },
    });
  }

  async update(tenantId: string, id: string, dto: UpdateVideoDto) {
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

    return this.prisma.video.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(tenantId: string, id: string) {
    await this.findOne(tenantId, id);

    return this.prisma.video.update({
      where: { id },
      data: { status: ArticleStatus.ARCHIVED },
    });
  }

  private async generateUniqueSlug(
    tenantId: string,
    title: string,
  ): Promise<string> {
    let slug = slugify(title, { lower: true, strict: true, locale: 'tr' });

    const existing = await this.prisma.video.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });

    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    return slug;
  }
}
