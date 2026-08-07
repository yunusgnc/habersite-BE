import { CommentStatus } from '@prisma/client';
export declare class QueryCommentsDto {
    articleId?: string;
    status?: CommentStatus;
    cursor?: string;
    limit?: number;
}
