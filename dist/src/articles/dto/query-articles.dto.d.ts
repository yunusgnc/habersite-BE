import { ArticleStatus, ArticleType } from '@prisma/client';
export declare class QueryArticlesDto {
    cursor?: string;
    limit?: number;
    status?: ArticleStatus;
    type?: ArticleType;
    categorySlug?: string;
    categoryId?: string;
    authorSlug?: string;
    search?: string;
    searchScope?: 'title' | 'all';
    from?: string;
    to?: string;
    tagSlug?: string;
    featured?: string;
    createdById?: string;
    sort?: string;
}
