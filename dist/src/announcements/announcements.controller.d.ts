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
        pinned: boolean;
        expiresAt: Date | null;
    }[]>;
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        pinned: boolean;
        expiresAt: Date | null;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        pinned: boolean;
        expiresAt: Date | null;
    }>;
    create(tenantId: string, dto: CreateAnnouncementDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        pinned: boolean;
        expiresAt: Date | null;
    }>;
    update(tenantId: string, id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        pinned: boolean;
        expiresAt: Date | null;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        createdAt: Date;
        tenantId: string;
        type: string;
        title: string;
        content: string | null;
        pinned: boolean;
        expiresAt: Date | null;
    }>;
}
