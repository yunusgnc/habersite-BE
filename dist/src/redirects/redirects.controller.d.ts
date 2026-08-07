import { RedirectsService } from './redirects.service';
export declare class RedirectsController {
    private redirectsService;
    constructor(redirectsService: RedirectsService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }[]>;
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
    createMany(tenantId: string, data: {
        redirects: {
            source: string;
            target: string;
            permanent?: boolean;
        }[];
    }): Promise<import("@prisma/client").Prisma.BatchPayload>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        source: string;
        target: string;
        permanent: boolean;
    }>;
}
