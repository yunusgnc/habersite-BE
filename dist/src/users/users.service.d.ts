import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly selectFields;
    findAll(tenantId: string, opts?: {
        cursor?: string;
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
    }): Promise<import("../common/pagination/sayfali-liste").SayfaliSonuc<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
    }>>;
    findById(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
    }>;
    create(tenantId: string, data: {
        name: string;
        email: string;
        password: string;
        role?: UserRole;
        active?: boolean;
    }): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
    }>;
    update(tenantId: string, id: string, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: UserRole;
        active?: boolean;
    }): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
    }>;
    updateRole(tenantId: string, id: string, role: UserRole): Promise<{
        id: string;
        name: string;
        email: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    toggleActive(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        passwordHash: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        username: string | null;
        passwordResetTokenHash: string | null;
        passwordResetExpiresAt: Date | null;
    }>;
}
