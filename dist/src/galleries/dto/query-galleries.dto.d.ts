import { ArticleStatus } from '@prisma/client';
export declare class QueryGalleriesDto {
    cursor?: string;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
}
