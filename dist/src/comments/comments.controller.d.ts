import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { CommentStatus } from '@prisma/client';
import type { Request } from 'express';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    findByArticle(tenantId: string, articleId: string): Promise<({
        replies: {
            id: string;
            tenantId: string;
            email: string;
            name: string;
            createdAt: Date;
            ipAddress: string | null;
            articleId: string;
            parentId: string | null;
            content: string;
            status: import("@prisma/client").$Enums.CommentStatus;
        }[];
    } & {
        id: string;
        tenantId: string;
        email: string;
        name: string;
        createdAt: Date;
        ipAddress: string | null;
        articleId: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
    })[]>;
    findAll(tenantId: string, query: QueryCommentsDto): Promise<{
        items: {
            id: string;
            tenantId: string;
            email: string;
            name: string;
            createdAt: Date;
            ipAddress: string | null;
            articleId: string;
            parentId: string | null;
            content: string;
            status: import("@prisma/client").$Enums.CommentStatus;
        }[];
        nextCursor: string | undefined;
        total: number;
    }>;
    create(tenantId: string, dto: CreateCommentDto, req: Request): Promise<{
        id: string;
        tenantId: string;
        email: string;
        name: string;
        createdAt: Date;
        ipAddress: string | null;
        articleId: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
    }>;
    updateStatus(tenantId: string, id: string, status: CommentStatus): Promise<{
        id: string;
        tenantId: string;
        email: string;
        name: string;
        createdAt: Date;
        ipAddress: string | null;
        articleId: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
    }>;
    bulkUpdateStatus(tenantId: string, dto: {
        ids: string[];
        status: CommentStatus;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
