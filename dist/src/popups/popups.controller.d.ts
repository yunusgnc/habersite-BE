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
            active: boolean;
            createdAt: Date;
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
    findActive(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        imageUrl: string | null;
        targetUrl: string | null;
        startsAt: Date | null;
        endsAt: Date | null;
        trigger: string;
        delayMs: number;
    }>;
    create(tenantId: string, dto: CreatePopupDto): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        createdAt: Date;
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
        tenantId: string;
        active: boolean;
        createdAt: Date;
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
