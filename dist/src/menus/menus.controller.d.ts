import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    findAll(tenantId: string): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        items: import("@prisma/client/runtime/client").JsonValue;
        label: string | null;
    }[]>;
    findByLocation(tenantId: string, location: string): Promise<{
        items: {
            label: string;
            url: string;
            order: number;
        }[];
        id?: string | undefined;
        updatedAt?: Date | undefined;
        tenantId?: string | undefined;
        location?: string | undefined;
        label?: string | null | undefined;
    }>;
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
