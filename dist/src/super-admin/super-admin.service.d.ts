import { PrismaService } from '../prisma/prisma.service';
import { WidgetFeederService } from '../widgets/widget-feeder.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ResetAdminPasswordDto, UpdateTenantDto } from './dto/update-tenant.dto';
export declare class SuperAdminService {
    private readonly prisma;
    private readonly feeder;
    private readonly logger;
    constructor(prisma: PrismaService, feeder: WidgetFeederService);
    overview(): Promise<{
        tenants: number;
        activeTenants: number;
        users: number;
        articles: number;
    }>;
    findAll(): Promise<{
        active: boolean;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        subdomain: string | null;
        logo: string | null;
        theme: string;
        plan: string;
        createdAt: Date;
        _count: {
            users: number;
            categories: number;
            articles: number;
            media: number;
        };
    }[]>;
    findOne(id: string): Promise<{
        active: boolean;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        subdomain: string | null;
        logo: string | null;
        favicon: string | null;
        theme: string;
        locale: string;
        timezone: string;
        plan: string;
        createdAt: Date;
        users: {
            active: boolean;
            id: string;
            name: string;
            email: string;
            username: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            lastLoginAt: Date | null;
        }[];
        _count: {
            users: number;
            categories: number;
            articles: number;
            media: number;
        };
    }>;
    create(dto: CreateTenantDto): Promise<{
        active: boolean;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        subdomain: string | null;
        logo: string | null;
        favicon: string | null;
        theme: string;
        locale: string;
        timezone: string;
        plan: string;
        createdAt: Date;
        users: {
            active: boolean;
            id: string;
            name: string;
            email: string;
            username: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            lastLoginAt: Date | null;
        }[];
        _count: {
            users: number;
            categories: number;
            articles: number;
            media: number;
        };
    }>;
    update(id: string, dto: UpdateTenantDto): Promise<{
        active: boolean;
        id: string;
        name: string;
        slug: string;
        domain: string | null;
        subdomain: string | null;
        logo: string | null;
        favicon: string | null;
        theme: string;
        locale: string;
        timezone: string;
        plan: string;
        createdAt: Date;
        users: {
            active: boolean;
            id: string;
            name: string;
            email: string;
            username: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            lastLoginAt: Date | null;
        }[];
        _count: {
            users: number;
            categories: number;
            articles: number;
            media: number;
        };
    }>;
    remove(id: string, requesterTenantId: string): Promise<{
        deleted: boolean;
    }>;
    resetAdminPassword(tenantId: string, dto: ResetAdminPasswordDto): Promise<{
        ok: boolean;
        userId: string;
        email: string;
    }>;
    private ensureExists;
}
