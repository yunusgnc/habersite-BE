import { GalleriesService } from './galleries.service';
import { CreateGalleryDto, CreateGalleryImageDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { QueryGalleriesDto } from './dto/query-galleries.dto';
export declare class GalleriesController {
    private readonly galleriesService;
    constructor(galleriesService: GalleriesService);
    findAll(tenantId: string, query: QueryGalleriesDto): Promise<{
        items: ({
            _count: {
                images: number;
            };
        } & {
            id: string;
            tenantId: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ArticleStatus;
            title: string;
            slug: string;
            publishedAt: Date | null;
            viewCount: number;
            seoTitle: string | null;
            seoDesc: string | null;
            headline: string | null;
            description: string | null;
            coverImage: string | null;
            categoryId: string | null;
            sortOrder: number;
            seoKeywords: string | null;
        })[];
        nextCursor: string | undefined;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        images: {
            id: string;
            sortOrder: number;
            galleryId: string;
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ArticleStatus;
        title: string;
        slug: string;
        publishedAt: Date | null;
        viewCount: number;
        seoTitle: string | null;
        seoDesc: string | null;
        headline: string | null;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        sortOrder: number;
        seoKeywords: string | null;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        images: {
            id: string;
            sortOrder: number;
            galleryId: string;
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ArticleStatus;
        title: string;
        slug: string;
        publishedAt: Date | null;
        viewCount: number;
        seoTitle: string | null;
        seoDesc: string | null;
        headline: string | null;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        sortOrder: number;
        seoKeywords: string | null;
    }>;
    create(tenantId: string, dto: CreateGalleryDto): Promise<{
        images: {
            id: string;
            sortOrder: number;
            galleryId: string;
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ArticleStatus;
        title: string;
        slug: string;
        publishedAt: Date | null;
        viewCount: number;
        seoTitle: string | null;
        seoDesc: string | null;
        headline: string | null;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        sortOrder: number;
        seoKeywords: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateGalleryDto): Promise<{
        images: {
            id: string;
            sortOrder: number;
            galleryId: string;
            url: string;
            caption: string | null;
            credit: string | null;
            alt: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ArticleStatus;
        title: string;
        slug: string;
        publishedAt: Date | null;
        viewCount: number;
        seoTitle: string | null;
        seoDesc: string | null;
        headline: string | null;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        sortOrder: number;
        seoKeywords: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ArticleStatus;
        title: string;
        slug: string;
        publishedAt: Date | null;
        viewCount: number;
        seoTitle: string | null;
        seoDesc: string | null;
        headline: string | null;
        description: string | null;
        coverImage: string | null;
        categoryId: string | null;
        sortOrder: number;
        seoKeywords: string | null;
    }>;
    addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeImage(tenantId: string, imageId: string): Promise<{
        id: string;
        sortOrder: number;
        galleryId: string;
        url: string;
        caption: string | null;
        credit: string | null;
        alt: string | null;
    }>;
    reorderImages(tenantId: string, galleryId: string, imageIds: string[]): Promise<{
        id: string;
        sortOrder: number;
        galleryId: string;
        url: string;
        caption: string | null;
        credit: string | null;
        alt: string | null;
    }[]>;
}
