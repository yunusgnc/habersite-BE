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
            title: string;
            slug: string;
            publishedAt: Date;
            viewCount: number;
            attachments: Prisma.JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
            summary: string | null;
            expiresAt: Date | null;
        }[];
        nextCursor: string | null;
    }>;
    findBySlug(tenantId: string, slug: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        title: string;
        slug: string;
        publishedAt: Date;
        viewCount: number;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
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
            tenantId: string;
            active: boolean;
            createdAt: Date;
            updatedAt: Date;
            content: string;
            title: string;
            slug: string;
            publishedAt: Date;
            viewCount: number;
            attachments: Prisma.JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
            summary: string | null;
            expiresAt: Date | null;
        }[];
        nextCursor: string | null;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        title: string;
        slug: string;
        publishedAt: Date;
        viewCount: number;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        active: number;
        expired: number;
    }>;
    create(tenantId: string, dto: CreateOfficialNoticeDto): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        title: string;
        slug: string;
        publishedAt: Date;
        viewCount: number;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateOfficialNoticeDto): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        title: string;
        slug: string;
        publishedAt: Date;
        viewCount: number;
        attachments: Prisma.JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private uniqueSlug;
}
