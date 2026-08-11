import { MessageStatus, MessageType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
type FindAllOpts = {
    limit?: number;
    cursor?: string;
    unreadOnly?: boolean;
    type?: MessageType;
    status?: MessageStatus;
    search?: string;
};
export declare class ContactMessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(tenantId: string, dto: CreateContactMessageDto, meta: {
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        ok: boolean;
        id: string;
    }>;
    findAll(tenantId: string, opts?: FindAllOpts): Promise<{
        data: {
            id: string;
            type: import("@prisma/client").$Enums.MessageType;
            status: import("@prisma/client").$Enums.MessageStatus;
            name: string;
            email: string;
            phone: string | null;
            subject: string | null;
            message: string;
            targetUrl: string | null;
            district: string | null;
            attachments: Prisma.JsonValue;
            adminNote: string | null;
            handledAt: Date | null;
            read: boolean;
            ipAddress: string | null;
            userAgent: string | null;
            createdAt: Date;
            tenantId: string;
        }[];
        nextCursor: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        unread: number;
        byType: Record<import("@prisma/client").$Enums.MessageType, number>;
        byStatus: Record<import("@prisma/client").$Enums.MessageStatus, number>;
    }>;
    markRead(tenantId: string, id: string, read?: boolean): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.MessageType;
        status: import("@prisma/client").$Enums.MessageStatus;
        name: string;
        email: string;
        phone: string | null;
        subject: string | null;
        message: string;
        targetUrl: string | null;
        district: string | null;
        attachments: Prisma.JsonValue;
        adminNote: string | null;
        handledAt: Date | null;
        read: boolean;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        tenantId: string;
    }>;
    updateStatus(tenantId: string, id: string, dto: UpdateMessageStatusDto): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.MessageType;
        status: import("@prisma/client").$Enums.MessageStatus;
        name: string;
        email: string;
        phone: string | null;
        subject: string | null;
        message: string;
        targetUrl: string | null;
        district: string | null;
        attachments: Prisma.JsonValue;
        adminNote: string | null;
        handledAt: Date | null;
        read: boolean;
        ipAddress: string | null;
        userAgent: string | null;
        createdAt: Date;
        tenantId: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private ensureExists;
}
export {};
