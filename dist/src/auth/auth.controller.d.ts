import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthController {
    private readonly authService;
    private readonly prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    login(dto: LoginDto, tenantIdHeader?: string, host?: string): Promise<AuthResponseDto>;
    forgotPassword(tenantId: string, body: {
        email: string;
    }): Promise<{
        devToken?: string | undefined;
        ok: boolean;
    }>;
    resetPassword(body: {
        token: string;
        password: string;
    }): Promise<{
        ok: true;
    }>;
    register(tenantId: string, dto: RegisterDto): Promise<AuthResponseDto>;
    me(req: any): Promise<{
        user: {
            id: string;
            tenantId: string;
            name: string;
            email: string;
            avatar: string | null;
            role: import("@prisma/client").$Enums.UserRole;
        } | null;
    }>;
}
