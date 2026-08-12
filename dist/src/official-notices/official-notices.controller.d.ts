import { OfficialNoticesService } from './official-notices.service';
import { CreateOfficialNoticeDto } from './dto/create-official-notice.dto';
import { UpdateOfficialNoticeDto } from './dto/update-official-notice.dto';
export declare class OfficialNoticesController {
    private readonly service;
    constructor(service: OfficialNoticesService);
    findPublic(tenantId: string, limit?: string, cursor?: string, noticeType?: string, institution?: string, search?: string, archived?: string): Promise<{
        data: {
            id: string;
            title: string;
            slug: string;
            publishedAt: Date;
            viewCount: number;
            attachments: import("@prisma/client/runtime/client").JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
            summary: string | null;
            expiresAt: Date | null;
        }[];
        nextCursor: string | null;
    }>;
    institutions(tenantId: string): Promise<{
        name: string;
        count: number;
    }[]>;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, noticeType?: string, search?: string): Promise<{
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
            attachments: import("@prisma/client/runtime/client").JsonValue;
            noticeType: import("@prisma/client").$Enums.NoticeType;
            institution: string;
            referenceNo: string | null;
            summary: string | null;
            expiresAt: Date | null;
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
        tenantId: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        content: string;
        title: string;
        slug: string;
        publishedAt: Date;
        viewCount: number;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
        noticeType: import("@prisma/client").$Enums.NoticeType;
        institution: string;
        referenceNo: string | null;
        summary: string | null;
        expiresAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
