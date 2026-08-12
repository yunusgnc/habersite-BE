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
            email: string;
            name: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
            active: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
        }[];
        nextCursor: string | undefined;
        total: number;
    }>;
    findById(tenantId: string, id: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    create(tenantId: string, data: {
        name: string;
        email: string;
        password: string;
        role?: UserRole;
        active?: boolean;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    update(tenantId: string, id: string, data: {
        name?: string;
        email?: string;
        password?: string;
        role?: UserRole;
        active?: boolean;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
    }>;
    updateRole(tenantId: string, id: string, role: UserRole): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.UserRole;
    }>;
    toggleActive(tenantId: string, id: string): Promise<{
        id: string;
        name: string;
        active: boolean;
    }>;
    remove(tenantId: string, id: string): Promise<{
        id: string;
        tenantId: string;
        email: string;
        username: string | null;
        passwordHash: string;
        name: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        lastLoginAt: Date | null;
        passwordResetTokenHash: string | null;
        passwordResetExpiresAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
