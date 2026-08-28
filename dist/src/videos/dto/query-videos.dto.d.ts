import { ArticleStatus } from '@prisma/client';
export declare class QueryVideosDto {
    page?: number;
    cursor?: string;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
}
