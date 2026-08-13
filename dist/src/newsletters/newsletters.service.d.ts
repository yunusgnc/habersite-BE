import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto, ListCampaignsQuery, UpdateCampaignDto } from './dto/newsletter-campaign.dto';
export declare class NewslettersService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        tenantId: string;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }[]>;
    subscribe(tenantId: string, email: string, name?: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        tenantId: string;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }>;
    unsubscribe(tenantId: string, email: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    getCount(tenantId: string): Promise<number>;
    listCampaigns(tenantId: string, query: ListCampaignsQuery): Promise<{
        items: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            tenantId: string;
            status: import("@prisma/client").$Enums.NewsletterCampaignStatus;
            scheduledAt: Date | null;
            createdBy: string | null;
            subject: string;
            preheader: string | null;
            htmlBody: string;
            textBody: string | null;
            sentAt: Date | null;
            recipients: number;
            failed: number;
        }[];
        total: number;
        page: number;
        perPage: number;
    }>;
    getCampaign(tenantId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.NewsletterCampaignStatus;
        scheduledAt: Date | null;
        createdBy: string | null;
        subject: string;
        preheader: string | null;
        htmlBody: string;
        textBody: string | null;
        sentAt: Date | null;
        recipients: number;
        failed: number;
    }>;
    createCampaign(tenantId: string, userId: string | null, dto: CreateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.NewsletterCampaignStatus;
        scheduledAt: Date | null;
        createdBy: string | null;
        subject: string;
        preheader: string | null;
        htmlBody: string;
        textBody: string | null;
        sentAt: Date | null;
        recipients: number;
        failed: number;
    }>;
    updateCampaign(tenantId: string, id: string, dto: UpdateCampaignDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.NewsletterCampaignStatus;
        scheduledAt: Date | null;
        createdBy: string | null;
        subject: string;
        preheader: string | null;
        htmlBody: string;
        textBody: string | null;
        sentAt: Date | null;
        recipients: number;
        failed: number;
    }>;
    removeCampaign(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
    sendCampaign(tenantId: string, id: string, dryRun?: boolean): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        status: import("@prisma/client").$Enums.NewsletterCampaignStatus;
        scheduledAt: Date | null;
        createdBy: string | null;
        subject: string;
        preheader: string | null;
        htmlBody: string;
        textBody: string | null;
        sentAt: Date | null;
        recipients: number;
        failed: number;
    } | {
        dryRun: boolean;
        recipients: number;
        message: string;
    }>;
}
