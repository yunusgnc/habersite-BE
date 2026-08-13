import { SuperAdminService } from './super-admin.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { ResetAdminPasswordDto, UpdateTenantDto } from './dto/update-tenant.dto';
export declare class SuperAdminController {
    private readonly service;
    constructor(service: SuperAdminService);
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
        mediaBaseUrl: string | null;
        theme: string;
        locale: string;
        timezone: string;
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
        mediaBaseUrl: string | null;
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
        mediaBaseUrl: string | null;
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
        mediaBaseUrl: string | null;
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
    remove(id: string, req: any): Promise<{
        deleted: boolean;
    }>;
    resetPassword(id: string, dto: ResetAdminPasswordDto): Promise<{
        ok: boolean;
        userId: string;
        email: string;
    }>;
}
