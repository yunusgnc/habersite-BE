import { PrismaService } from '../prisma/prisma.service';
export declare class RedirectsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }[]>;
    resolve(tenantId: string, source: string): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    } | null>;
    create(tenantId: string, data: {
        source: string;
        target: string;
        permanent?: boolean;
    }): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }>;
    createMany(tenantId: string, redirects: {
        source: string;
        target: string;
        permanent?: boolean;
    }[]): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }>;
}
