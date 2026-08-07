import { PrismaService } from '../prisma/prisma.service';
export declare class SeoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private siteUrl;
    buildSitemap(tenantId: string): Promise<string>;
    private urlEntry;
    buildRss(tenantId: string): Promise<string>;
}
