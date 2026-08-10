import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';
export declare class PopupsService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string, page?: number, limit?: number): Promise<{
        items: {
            id: string;
            tenantId: string;
            title: string;
            content: string | null;
            imageUrl: string | null;
            targetUrl: string | null;
            trigger: string;
            delayMs: number;
            active: boolean;
            startsAt: Date | null;
            endsAt: Date | null;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        trigger: string;
        delayMs: number;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        createdAt: Date;
    }>;
    findActive(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        trigger: string;
        delayMs: number;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        createdAt: Date;
    }[]>;
    create(tenantId: string, dto: CreatePopupDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        trigger: string;
        delayMs: number;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdatePopupDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        trigger: string;
        delayMs: number;
        active: boolean;
        startsAt: Date | null;
        endsAt: Date | null;
        createdAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
