import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
    }[]>;
    findByLocation(tenantId: string, location: string): Promise<{
        id: string;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
    } | {
        location: string;
        items: never[];
    }>;
    upsert(tenantId: string, dto: CreateMenuDto): Promise<{
        id: string;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
    }>;
    update(tenantId: string, location: string, dto: UpdateMenuDto): Promise<{
        id: string;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
    }>;
    remove(tenantId: string, location: string): Promise<{
        id: string;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
        updatedAt: Date;
    }>;
}
