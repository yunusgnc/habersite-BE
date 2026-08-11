import { PrismaService } from '../prisma/prisma.service';
import type { Prisma } from '@prisma/client';
import type { CreateGalleryDto, CreateGalleryImageDto } from './dto/create-gallery.dto';
import type { UpdateGalleryDto } from './dto/update-gallery.dto';
import type { QueryGalleriesDto } from './dto/query-galleries.dto';
export declare class GalleriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string, query: QueryGalleriesDto): Promise<{
        items: ({
            _count: {
                images: number;
            };
        } & {
            id: string;
            tenantId: string;
            sortOrder: number;
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            seoTitle: string | null;
            seoDesc: string | null;
            title: string;
            status: import("@prisma/client").$Enums.ArticleStatus;
            publishedAt: Date | null;
            viewCount: number;
            categoryId: string | null;
            headline: string | null;
            coverImage: string | null;
            seoKeywords: string | null;
        })[];
        nextCursor: string | undefined;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        images: {
            id: string;
            sortOrder: number;
            url: string;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        sortOrder: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        viewCount: number;
        categoryId: string | null;
        headline: string | null;
        coverImage: string | null;
        seoKeywords: string | null;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        images: {
            id: string;
            sortOrder: number;
            url: string;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        sortOrder: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        viewCount: number;
        categoryId: string | null;
        headline: string | null;
        coverImage: string | null;
        seoKeywords: string | null;
    }>;
    create(tenantId: string, dto: CreateGalleryDto): Promise<{
        images: {
            id: string;
            sortOrder: number;
            url: string;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        sortOrder: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        viewCount: number;
        categoryId: string | null;
        headline: string | null;
        coverImage: string | null;
        seoKeywords: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateGalleryDto): Promise<{
        images: {
            id: string;
            sortOrder: number;
            url: string;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        tenantId: string;
        sortOrder: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        viewCount: number;
        categoryId: string | null;
        headline: string | null;
        coverImage: string | null;
        seoKeywords: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        sortOrder: number;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        viewCount: number;
        categoryId: string | null;
        headline: string | null;
        coverImage: string | null;
        seoKeywords: string | null;
    }>;
    addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]): Promise<Prisma.BatchPayload>;
    removeImage(tenantId: string, imageId: string): Promise<{
        id: string;
        sortOrder: number;
        url: string;
        alt: string | null;
        credit: string | null;
        caption: string | null;
        galleryId: string;
    }>;
    reorderImages(tenantId: string, galleryId: string, imageIds: string[]): Promise<{
        id: string;
        sortOrder: number;
        url: string;
        alt: string | null;
        credit: string | null;
        caption: string | null;
        galleryId: string;
    }[]>;
    private generateUniqueSlug;
}
