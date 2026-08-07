import { ArticleStatus } from '@prisma/client';
export declare class UpdateGalleryDto {
    title?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    categoryId?: string;
    status?: ArticleStatus;
    publishedAt?: string;
    sortOrder?: number;
}
