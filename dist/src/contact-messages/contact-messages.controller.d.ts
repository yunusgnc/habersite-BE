import { ContactMessagesService } from './contact-messages.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
export declare class ContactMessagesController {
    private readonly service;
    constructor(service: ContactMessagesService);
    create(tenantId: string, dto: CreateContactMessageDto, ip: string, req: any): Promise<{
        ok: boolean;
        id: string;
    }>;
    findAll(tenantId: string, limit?: string, cursor?: string, unreadOnly?: string): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string;
            email: string;
            ipAddress: string | null;
            read: boolean;
            phone: string | null;
            subject: string | null;
            message: string;
            userAgent: string | null;
        }[];
        nextCursor: string | null;
    }>;
    stats(tenantId: string): Promise<{
        total: number;
        unread: number;
    }>;
    markRead(tenantId: string, id: string, read?: boolean): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        tenantId: string;
        email: string;
        ipAddress: string | null;
        read: boolean;
        phone: string | null;
        subject: string | null;
        message: string;
        userAgent: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
