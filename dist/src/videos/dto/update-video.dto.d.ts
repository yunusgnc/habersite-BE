import { ArticleStatus } from '@prisma/client';
export declare class UpdateVideoDto {
    title?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    videoUrl?: string;
    source?: string;
    duration?: number;
    categoryId?: string;
    status?: ArticleStatus;
    publishedAt?: string;
    sortOrder?: number;
}
