import { PrismaService } from '../prisma/prisma.service';
export declare class NewslettersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        name: string | null;
        createdAt: Date;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }[]>;
    subscribe(tenantId: string, email: string, name?: string): Promise<{
        id: string;
        tenantId: string;
        name: string | null;
        createdAt: Date;
        email: string;
        confirmed: boolean;
        unsubscribed: boolean;
    }>;
    unsubscribe(tenantId: string, email: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    getCount(tenantId: string): Promise<number>;
}
