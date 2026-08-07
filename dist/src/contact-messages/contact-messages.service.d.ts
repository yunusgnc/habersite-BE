import { PrismaService } from '../prisma/prisma.service';
import { CreateContactMessageDto } from './dto/create-contact-message.dto';
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
    findAll(tenantId: string, opts?: {
        limit?: number;
        cursor?: string;
        unreadOnly?: boolean;
    }): Promise<{
        data: {
            id: string;
            name: string;
            createdAt: Date;
            tenantId: string;
            email: string;
            ipAddress: string | null;
            phone: string | null;
            subject: string | null;
            message: string;
            read: boolean;
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
        phone: string | null;
        subject: string | null;
        message: string;
        read: boolean;
        userAgent: string | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    private ensureExists;
}
