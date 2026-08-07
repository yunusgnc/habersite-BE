import { ArticleStatus } from '@prisma/client';
export declare class QueryVideosDto {
    cursor?: string;
    limit?: number;
    status?: ArticleStatus;
    search?: string;
}
