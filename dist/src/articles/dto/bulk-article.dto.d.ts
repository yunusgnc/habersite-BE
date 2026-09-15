import { ArticleStatus } from '@prisma/client';
export declare class BulkArticleDto {
    ids: string[];
    status: ArticleStatus;
}
export declare class BulkCategoryDto {
    ids: string[];
    categoryId: string;
}
