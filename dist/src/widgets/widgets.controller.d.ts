import { WidgetsService } from './widgets.service';
import { WidgetFeederService } from './widget-feeder.service';
export declare class WidgetsController {
    private widgetsService;
    private feeder;
    constructor(widgetsService: WidgetsService, feeder: WidgetFeederService);
    refresh(tenantId: string, type: string): Promise<{
        ok: boolean;
        cachedAt: Date;
    }>;
    findActive(tenantId: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        sortOrder: number;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }[]>;
    findAll(tenantId: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        sortOrder: number;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }[]>;
    findByType(tenantId: string, type: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        sortOrder: number;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    } | null>;
    upsert(tenantId: string, type: string, data: {
        config?: any;
        active?: boolean;
        sortOrder?: number;
    }): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        sortOrder: number;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }>;
    remove(tenantId: string, type: string): Promise<{
        id: string;
        active: boolean;
        tenantId: string;
        type: string;
        config: import("@prisma/client/runtime/client").JsonValue;
        sortOrder: number;
        cache: import("@prisma/client/runtime/client").JsonValue | null;
        cachedAt: Date | null;
    }>;
}
