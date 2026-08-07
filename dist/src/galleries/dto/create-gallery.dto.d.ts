import { ArticleStatus } from '@prisma/client';
export declare class CreateGalleryImageDto {
    url: string;
    caption?: string;
    credit?: string;
    alt?: string;
    sortOrder?: number;
}
export declare class CreateGalleryDto {
    title: string;
    headline?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    categoryId?: string;
    status?: ArticleStatus;
    publishedAt?: string;
    sortOrder?: number;
    images?: CreateGalleryImageDto[];
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
}
