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
            sortOrder: number;
            title: string;
            headline: string | null;
            slug: string;
            description: string | null;
            coverImage: string | null;
            categoryId: string | null;
            status: import("@prisma/client").$Enums.ArticleStatus;
            publishedAt: Date | null;
            seoTitle: string | null;
            seoDesc: string | null;
            seoKeywords: string | null;
            id: string;
            tenantId: string;
            viewCount: number;
            createdAt: Date;
            updatedAt: Date;
        })[];
        nextCursor: string | undefined;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        images: {
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
            sortOrder: number;
            id: string;
            galleryId: string;
        }[];
    } & {
        sortOrder: number;
        title: string;
        headline: string | null;
        slug: string;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDesc: string | null;
        seoKeywords: string | null;
        id: string;
        tenantId: string;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        images: {
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
            sortOrder: number;
            id: string;
            galleryId: string;
        }[];
    } & {
        sortOrder: number;
        title: string;
        headline: string | null;
        slug: string;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDesc: string | null;
        seoKeywords: string | null;
        id: string;
        tenantId: string;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(tenantId: string, dto: CreateGalleryDto): Promise<{
        images: {
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
            sortOrder: number;
            id: string;
            galleryId: string;
        }[];
    } & {
        sortOrder: number;
        title: string;
        headline: string | null;
        slug: string;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDesc: string | null;
        seoKeywords: string | null;
        id: string;
        tenantId: string;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateGalleryDto): Promise<{
        images: {
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
            sortOrder: number;
            id: string;
            galleryId: string;
        }[];
    } & {
        sortOrder: number;
        title: string;
        headline: string | null;
        slug: string;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDesc: string | null;
        seoKeywords: string | null;
        id: string;
        tenantId: string;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        sortOrder: number;
        title: string;
        headline: string | null;
        slug: string;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        status: import("@prisma/client").$Enums.ArticleStatus;
        publishedAt: Date | null;
        seoTitle: string | null;
        seoDesc: string | null;
        seoKeywords: string | null;
        id: string;
        tenantId: string;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]): Promise<Prisma.BatchPayload>;
    removeImage(tenantId: string, imageId: string): Promise<{
        url: string;
        caption: string | null;
        credit: string | null;
        alt: string | null;
        sortOrder: number;
        id: string;
        galleryId: string;
    }>;
    reorderImages(tenantId: string, galleryId: string, imageIds: string[]): Promise<{
        url: string;
        caption: string | null;
        credit: string | null;
        alt: string | null;
        sortOrder: number;
        id: string;
        galleryId: string;
    }[]>;
    private generateUniqueSlug;
}
