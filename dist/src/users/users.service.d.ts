import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly selectFields;
    findAll(tenantId: string, opts?: {
        cursor?: string;
        limit?: number;
        search?: string;
        role?: string;
    }): Promise<{
        items: {
            id: string;
            active: boolean;
            name: string;
            createdAt: Date;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            lastLoginAt: Date | null;
        }[];
        nextCursor: string | undefined;
        total: number;
    }>;
    findById(tenantId: string, id: string): Promise<{
        id: string;
        active: boolean;
        name: string;
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
        active: boolean;
        name: string;
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
        active: boolean;
        name: string;
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
        active: boolean;
        name: string;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        active: boolean;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        username: string | null;
        passwordHash: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        passwordResetTokenHash: string | null;
        passwordResetExpiresAt: Date | null;
    }>;
}
