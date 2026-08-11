import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
export declare class AnnouncementsService {
    private prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }[]>;
    findOne(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    findActive(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }[]>;
    create(tenantId: string, dto: CreateAnnouncementDto): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    update(tenantId: string, id: string, dto: UpdateAnnouncementDto): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        type: string;
        active: boolean;
        createdAt: Date;
        title: string;
        content: string | null;
        expiresAt: Date | null;
        pinned: boolean;
    }>;
}
