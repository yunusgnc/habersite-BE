import { ArticleStatus } from '@prisma/client';
export declare class CreateVideoDto {
    title: string;
    headline?: string;
    slug?: string;
    description?: string;
    coverImage?: string;
    videoUrl?: string;
    embedCode?: string;
    source?: string;
    duration?: number;
    fileSize?: number;
    categoryId?: string;
    status?: ArticleStatus;
    publishedAt?: string;
    sortOrder?: number;
    seoTitle?: string;
    seoDesc?: string;
    seoKeywords?: string;
}
