import { ArticleType, ArticleStatus } from '@prisma/client';
export declare class CreateArticleDto {
    title: string;
    content: Record<string, any>;
    type?: ArticleType;
    spot?: string;
    featuredImage?: string;
    status?: ArticleStatus;
    categoryIds?: string[];
    tagNames?: string[];
    authorId?: string;
    seoTitle?: string;
    seoDesc?: string;
    source?: string;
    sourceUrl?: string;
    featured?: boolean;
    nationalFeatured?: boolean;
    headlineTitle?: string;
    headlineImage?: string;
    headlineFontSize?: number;
    headlineFontFamily?: string;
    hideHeadlineOverlay?: boolean;
    publishedAt?: string;
    scheduledAt?: string;
    breakingLabel?: string | null;
    assignedToId?: string | null;
    deadline?: string | null;
    reviewNote?: string | null;
}
