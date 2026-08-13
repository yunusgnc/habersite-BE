import { NewslettersService } from './newsletters.service';
import { CreateCampaignDto, ListCampaignsQuery, UpdateCampaignDto } from './dto/newsletter-campaign.dto';
export declare class NewslettersController {
    private newslettersService;
    constructor(newslettersService: NewslettersService);
    subscribe(tenantId: string, body: {
        email: string;
        name?: string;
    }): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        tenantId: string;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }>;
    unsubscribe(tenantId: string, body: {
        email: string;
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    findAll(tenantId: string): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        tenantId: string;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }[]>;
    getCount(tenantId: string): Promise<number>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
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
    createCampaign(tenantId: string, user: {
        id?: string;
    } | undefined, dto: CreateCampaignDto): Promise<{
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
    sendCampaign(tenantId: string, id: string, body?: {
        dryRun?: boolean;
    }): Promise<{
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
