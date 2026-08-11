import { OfficialNoticesService } from './official-notices.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';
export declare class OfficialNoticesController {
    private readonly service;
    constructor(service: OfficialNoticesService);
    findPublic(tenantId: string, limit?: string, cursor?: string, noticeType?: string, institution?: string, search?: string, archived?: string): Promise<{
        data: {
            institution: string;
            id: string;
            title: string;
            slug: string;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            referenceNo: string | null;
            summary: string | null;
            attachments: import("@prisma/client/runtime/client").JsonValue;
            publishedAt: Date;
            expiresAt: Date | null;
            viewCount: number;
        }[];
        nextCursor: string | null;
    }>;
    institutions(tenantId: string): Promise<{
        name: string;
        count: number;
    }[]>;
    findBySlug(tenantId: string, slug: string): Promise<{
        institution: string;
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        referenceNo: string | null;
        summary: string | null;
        content: string;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        publishedAt: Date;
        expiresAt: Date | null;
        active: boolean;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, noticeType?: string, search?: string): Promise<{
        data: {
            institution: string;
            id: string;
            tenantId: string;
            title: string;
            slug: string;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            referenceNo: string | null;
            summary: string | null;
            content: string;
            attachments: import("@prisma/client/runtime/client").JsonValue;
            publishedAt: Date;
            expiresAt: Date | null;
            active: boolean;
            viewCount: number;
            createdAt: Date;
            updatedAt: Date;
        }[];
        nextCursor: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        active: number;
        expired: number;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        institution: string;
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        referenceNo: string | null;
        summary: string | null;
        content: string;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        publishedAt: Date;
        expiresAt: Date | null;
        active: boolean;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(tenantId: string, dto: CreateOfficialNoticeDto): Promise<{
        institution: string;
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        referenceNo: string | null;
        summary: string | null;
        content: string;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        publishedAt: Date;
        expiresAt: Date | null;
        active: boolean;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateOfficialNoticeDto): Promise<{
        institution: string;
        id: string;
        tenantId: string;
        title: string;
        slug: string;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        referenceNo: string | null;
        summary: string | null;
        content: string;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        publishedAt: Date;
        expiresAt: Date | null;
        active: boolean;
        viewCount: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
