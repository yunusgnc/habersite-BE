import { PopupsService } from './popups.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { UpdatePopupDto } from './dto/update-popup.dto';
export declare class PopupsController {
    private readonly popupsService;
    constructor(popupsService: PopupsService);
    findAll(tenantId: string, page?: string, limit?: string): Promise<{
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
