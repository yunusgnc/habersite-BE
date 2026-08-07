import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    check(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    ready(): Promise<{
        status: string;
        timestamp: string;
        checks: Record<string, {
            ok: boolean;
            error?: string;
            latency?: number;
        }>;
    }>;
}
