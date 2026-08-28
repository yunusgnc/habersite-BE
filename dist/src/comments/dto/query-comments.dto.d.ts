import { CommentStatus } from '@prisma/client';
export declare class QueryCommentsDto {
    articleId?: string;
    status?: CommentStatus;
    page?: number;
    cursor?: string;
    limit?: number;
}
