import { PrismaService } from '../prisma/prisma.service';
import { RevalidationService } from '../common/revalidation/revalidation.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
type MenuItem = {
    label: string;
    url: string;
    order: number;
};
export declare class MenusService {
    private readonly prisma;
    private readonly revalidation;
    constructor(prisma: PrismaService, revalidation: RevalidationService);
    findAll(tenantId: string): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        label: string | null;
    }[]>;
    findByLocation(tenantId: string, location: string): Promise<{
        items: MenuItem[];
        id?: string | undefined;
        updatedAt?: Date | undefined;
        tenantId?: string | undefined;
        location?: string | undefined;
        label?: string | null | undefined;
    }>;
    private normalizeItems;
    private defaultForLocation;
    upsert(tenantId: string, dto: CreateMenuDto): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        label: string | null;
    }>;
    update(tenantId: string, location: string, dto: UpdateMenuDto): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        label: string | null;
    }>;
    remove(tenantId: string, location: string): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        label: string | null;
    }>;
}
export {};
