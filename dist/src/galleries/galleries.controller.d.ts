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
    addImages(tenantId: string, galleryId: string, images: CreateGalleryImageDto[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
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
}
