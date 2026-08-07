import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsController {
    private readonly announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }[]>;
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    create(tenantId: string, dto: CreateAnnouncementDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    update(tenantId: string, id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
}
