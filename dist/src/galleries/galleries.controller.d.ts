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
            slug: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            description: string | null;
            sortOrder: number;
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
            url: string;
            id: string;
            sortOrder: number;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        sortOrder: number;
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
            url: string;
            id: string;
            sortOrder: number;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        sortOrder: number;
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
            url: string;
            id: string;
            sortOrder: number;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        sortOrder: number;
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
            url: string;
            id: string;
            sortOrder: number;
            alt: string | null;
            credit: string | null;
            caption: string | null;
            galleryId: string;
        }[];
    } & {
        id: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        sortOrder: number;
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
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        description: string | null;
        sortOrder: number;
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
    addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    removeImage(tenantId: string, imageId: string): Promise<{
        url: string;
        id: string;
        sortOrder: number;
        alt: string | null;
        credit: string | null;
        caption: string | null;
        galleryId: string;
    }>;
    reorderImages(tenantId: string, galleryId: string, imageIds: string[]): Promise<{
        url: string;
        id: string;
        sortOrder: number;
        alt: string | null;
        credit: string | null;
        caption: string | null;
        galleryId: string;
    }[]>;
}
