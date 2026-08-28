import { UsersService } from './users.service';
import { UserRole } from '@prisma/client';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(tenantId: string, cursor?: string, page?: string, limit?: string, search?: string, role?: string): Promise<import("../common/pagination/sayfali-liste").SayfaliSonuc<{
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
    create(tenantId: string, body: {
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
    update(tenantId: string, id: string, body: {
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
    updateRole(tenantId: string, id: string, body: {
        role: UserRole;
    }): Promise<{
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
