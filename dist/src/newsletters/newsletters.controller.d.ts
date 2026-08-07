import { NewslettersService } from './newsletters.service';
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
}
