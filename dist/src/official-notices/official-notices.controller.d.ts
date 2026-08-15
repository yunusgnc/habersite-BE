import { OfficialNoticesService } from './official-notices.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';
export declare class OfficialNoticesController {
    private readonly service;
    constructor(service: OfficialNoticesService);
    findPublic(tenantId: string, limit?: string, cursor?: string, noticeType?: string, institution?: string, search?: string, archived?: string): Promise<{
        data: {
            id: string;
            slug: string;
            title: string;
            publishedAt: Date;
            viewCount: number;
            summary: string | null;
            expiresAt: Date | null;
            attachments: import("@prisma/client/runtime/client").JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
        }[];
        nextCursor: string | null;
    }>;
    institutions(tenantId: string): Promise<{
        name: string;
        count: number;
    }[]>;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, noticeType?: string, search?: string): Promise<{
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
            attachments: import("@prisma/client/runtime/client").JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
        }[];
        nextCursor: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        active: number;
        expired: number;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
