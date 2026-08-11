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
            active: boolean;
            createdAt: Date;
            tenantId: string;
            title: string;
            content: string | null;
            imageUrl: string | null;
            targetUrl: string | null;
            startsAt: Date | null;
            endsAt: Date | null;
            trigger: string;
            delayMs: number;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }>;
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }[]>;
    create(tenantId: string, dto: CreatePopupDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }>;
    update(tenantId: string, id: string, dto: UpdatePopupDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }>;
    remove(tenantId: string, id: string): Promise<{
        deleted: boolean;
    }>;
}
