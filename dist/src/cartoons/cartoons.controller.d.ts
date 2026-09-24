import { CartoonsService } from './cartoons.service';
import { CreateCartoonDto } from './dto/create-cartoon.dto';
import { UpdateCartoonDto } from './dto/update-cartoon.dto';
export declare class CartoonsController {
    private readonly service;
    constructor(service: CartoonsService);
    findPublic(tenantId: string, limit?: string, cursor?: string, page?: string, artist?: string, search?: string): Promise<{
        data: {
            id: string;
            slug: string;
            image: string;
            title: string;
            publishedAt: Date;
            viewCount: number;
            caption: string | null;
            imageAlt: string | null;
            artist: string | null;
        }[];
        nextCursor: string | null;
        total: number;
        page: number | undefined;
        totalPages: number;
        hasMore: boolean;
    }>;
    artists(tenantId: string): Promise<{
        name: string;
        count: number;
    }[]>;
    sitemap(tenantId: string): Promise<{
        slug: string;
        updatedAt: Date;
        publishedAt: Date;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        publishedAt: Date;
        viewCount: number;
        caption: string | null;
        imageAlt: string | null;
        artist: string | null;
    }>;
    neighbours(tenantId: string, slug: string): Promise<{
        previous: {
            slug: string;
            image: string;
            title: string;
        } | null;
        next: {
            slug: string;
            image: string;
            title: string;
        } | null;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, search?: string): Promise<{
        data: {
            id: string;
            slug: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            image: string;
            seoTitle: string | null;
            seoDesc: string | null;
            title: string;
            publishedAt: Date;
            viewCount: number;
            caption: string | null;
            imageAlt: string | null;
            artist: string | null;
        }[];
        nextCursor: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        active: number;
        scheduled: number;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        publishedAt: Date;
        viewCount: number;
        caption: string | null;
        imageAlt: string | null;
        artist: string | null;
    }>;
    create(tenantId: string, dto: CreateCartoonDto): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        publishedAt: Date;
        viewCount: number;
        caption: string | null;
        imageAlt: string | null;
        artist: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateCartoonDto): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        image: string;
        seoTitle: string | null;
        seoDesc: string | null;
        title: string;
        publishedAt: Date;
        viewCount: number;
        caption: string | null;
        imageAlt: string | null;
        artist: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
