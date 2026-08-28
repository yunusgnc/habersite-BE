import { ArticleStatus } from '@prisma/client';
export declare class QueryGalleriesDto {
    page?: number;
    cursor?: string;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
}
