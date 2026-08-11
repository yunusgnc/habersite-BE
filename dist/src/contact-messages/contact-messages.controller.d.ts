import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
import { UpdateMessageStatusDto } from './dto/update-message-status.dto';
export declare class ContactMessagesController {
    private readonly service;
    constructor(service: ContactMessagesService);
    create(tenantId: string, dto: CreateContactMessageDto, ip: string, req: any): Promise<{
        ok: boolean;
        id: string;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, unreadOnly?: string, type?: string, status?: string, search?: string): Promise<{
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
            attachments: import("@prisma/client/runtime/client").JsonValue;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
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
        attachments: import("@prisma/client/runtime/client").JsonValue;
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
    private parseEnum;
}
