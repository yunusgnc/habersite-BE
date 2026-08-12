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
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    findByLocation(tenantId: string, location: string): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
    } | {
        location: string;
        items: never[];
    }>;
    upsert(tenantId: string, dto: CreateMenuDto): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
    }>;
    update(tenantId: string, location: string, dto: UpdateMenuDto): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
    }>;
    remove(tenantId: string, location: string): Promise<{
        id: string;
        updatedAt: Date;
        tenantId: string;
        location: string;
        label: string | null;
        items: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
