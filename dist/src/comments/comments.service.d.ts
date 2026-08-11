import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { QueryCommentsDto } from './dto/query-comments.dto';
import { CommentStatus } from '@prisma/client';
export declare class CommentsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByArticle(tenantId: string, articleId: string): Promise<({
        replies: {
            id: string;
            tenantId: string;
            name: string;
            createdAt: Date;
            email: string;
            parentId: string | null;
            content: string;
            status: import("@prisma/client").$Enums.CommentStatus;
            articleId: string;
            ipAddress: string | null;
        }[];
    } & {
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        email: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
        articleId: string;
        ipAddress: string | null;
    })[]>;
    findAll(tenantId: string, query: QueryCommentsDto): Promise<{
        items: {
            id: string;
            tenantId: string;
            name: string;
            createdAt: Date;
            email: string;
            parentId: string | null;
            content: string;
            status: import("@prisma/client").$Enums.CommentStatus;
            articleId: string;
            ipAddress: string | null;
        }[];
        nextCursor: string | undefined;
        total: number;
    }>;
    create(tenantId: string, dto: CreateCommentDto, ipAddress: string): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        email: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
        articleId: string;
        ipAddress: string | null;
    }>;
    updateStatus(tenantId: string, id: string, status: CommentStatus): Promise<{
        id: string;
        tenantId: string;
        name: string;
        createdAt: Date;
        email: string;
        parentId: string | null;
        content: string;
        status: import("@prisma/client").$Enums.CommentStatus;
        articleId: string;
        ipAddress: string | null;
    }>;
    bulkUpdateStatus(tenantId: string, ids: string[], status: CommentStatus): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private spamScore;
}
