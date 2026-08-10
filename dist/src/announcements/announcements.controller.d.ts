import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>;
    findActive(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    create(tenantId: string, dto: CreateAnnouncementDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        title: string;
        content: string | null;
        type: string;
        active: boolean;
        pinned: boolean;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
}
