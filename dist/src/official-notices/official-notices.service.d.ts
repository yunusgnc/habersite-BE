import { NoticeType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';
export type PublicNoticeQuery = {
    limit?: number;
    cursor?: string;
    noticeType?: NoticeType;
    institution?: string;
    search?: string;
    archived?: boolean;
};
export declare class OfficialNoticesService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findPublic(tenantId: string, query?: PublicNoticeQuery): Promise<{
        data: {
            id: string;
            slug: string;
            title: string;
            publishedAt: Date;
            viewCount: number;
            summary: string | null;
            expiresAt: Date | null;
            attachments: Prisma.JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
        }[];
        nextCursor: string | null;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        content: string;
        publishedAt: Date;
        viewCount: number;
        summary: string | null;
        expiresAt: Date | null;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    institutions(tenantId: string): Promise<{
        name: string;
        count: number;
    }[]>;
    findAll(tenantId: string, opts?: {
        limit?: number;
        cursor?: string;
        noticeType?: NoticeType;
        search?: string;
    }): Promise<{
        data: {
            id: string;
            slug: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            title: string;
            content: string;
            publishedAt: Date;
            viewCount: number;
            summary: string | null;
            expiresAt: Date | null;
            attachments: Prisma.JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
        }[];
        nextCursor: string | null;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        content: string;
        publishedAt: Date;
        viewCount: number;
        summary: string | null;
        expiresAt: Date | null;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        active: number;
        expired: number;
    }>;
    create(tenantId: string, dto: CreateOfficialNoticeDto): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        content: string;
        publishedAt: Date;
        viewCount: number;
        summary: string | null;
        expiresAt: Date | null;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateOfficialNoticeDto): Promise<{
        id: string;
        slug: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        title: string;
        content: string;
        publishedAt: Date;
        viewCount: number;
        summary: string | null;
        expiresAt: Date | null;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private uniqueSlug;
}
