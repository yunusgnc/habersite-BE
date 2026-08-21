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
            name: string;
            createdAt: Date;
            tenantId: string;
            email: string;
            type: import("@prisma/client").$Enums.MessageType;
            status: import("@prisma/client").$Enums.MessageStatus;
            ipAddress: string | null;
            targetUrl: string | null;
            subject: string | null;
            read: boolean;
            phone: string | null;
            message: string;
            district: string | null;
            attachments: import("@prisma/client/runtime/client").JsonValue;
            adminNote: string | null;
            handledAt: Date | null;
            userAgent: string | null;
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
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        type: import("@prisma/client").$Enums.MessageType;
        status: import("@prisma/client").$Enums.MessageStatus;
        ipAddress: string | null;
        targetUrl: string | null;
        subject: string | null;
        read: boolean;
        phone: string | null;
        message: string;
        district: string | null;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        adminNote: string | null;
        handledAt: Date | null;
        userAgent: string | null;
    }>;
    updateStatus(tenantId: string, id: string, dto: UpdateMessageStatusDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        type: import("@prisma/client").$Enums.MessageType;
        status: import("@prisma/client").$Enums.MessageStatus;
        ipAddress: string | null;
        targetUrl: string | null;
        subject: string | null;
        read: boolean;
        phone: string | null;
        message: string;
        district: string | null;
        attachments: import("@prisma/client/runtime/client").JsonValue;
        adminNote: string | null;
        handledAt: Date | null;
        userAgent: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private parseEnum;
}
