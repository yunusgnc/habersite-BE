import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    validateUser(tenantId: string, identifier: string, password: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        username: string | null;
        passwordResetTokenHash: string | null;
        passwordResetExpiresAt: Date | null;
    }>;
    validateUserFlexible(identifier: string, password: string, tenantIdHint?: string, host?: string): Promise<{
        id: string;
        name: string;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
        tenantId: string;
        email: string;
        avatar: string | null;
        role: import("@prisma/client").$Enums.UserRole;
        lastLoginAt: Date | null;
        username: string | null;
        passwordResetTokenHash: string | null;
        passwordResetExpiresAt: Date | null;
    }>;
    login(user: {
        id: string;
        tenantId: string;
        role: string;
        name: string;
        email: string;
        avatar: string | null;
    }, rememberMe?: boolean): AuthResponseDto;
    register(tenantId: string, dto: RegisterDto): Promise<AuthResponseDto>;
    private readonly logger;
    createPasswordResetToken(tenantId: string, email: string): Promise<{
        ok: true;
        token?: string;
    }>;
    resetPasswordWithToken(token: string, newPassword: string): Promise<{
        ok: true;
    }>;
}
