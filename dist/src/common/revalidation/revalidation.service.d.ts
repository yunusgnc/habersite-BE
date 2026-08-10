import { PrismaService } from '../../prisma/prisma.service';
export declare class RevalidationService {
    private readonly prisma;
    private readonly logger;
    private readonly secret;
    private readonly defaultUrl;
    constructor(prisma: PrismaService);
    revalidateTenant(tenantId: string, tags: readonly string[]): void;
    private dispatch;
    private resolveBaseUrl;
}
