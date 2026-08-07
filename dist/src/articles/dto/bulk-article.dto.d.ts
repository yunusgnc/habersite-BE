import { ArticleStatus } from '@prisma/client';
export declare class BulkArticleDto {
    ids: string[];
    status: ArticleStatus;
}
