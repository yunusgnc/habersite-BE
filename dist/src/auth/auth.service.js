"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(tenantId, identifier, password) {
        const normalized = identifier.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({
            where: {
                tenantId,
                OR: [{ email: normalized }, { username: normalized }],
            },
        });
        if (!user || !user.active) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const passwordValid = await bcrypt.compare(password, user.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const { passwordHash, ...result } = user;
        return result;
    }
    async validateUserFlexible(identifier, password, tenantIdHint, host) {
        if (tenantIdHint) {
            return this.validateUser(tenantIdHint, identifier, password);
        }
        const normalized = identifier.trim().toLowerCase();
        const candidates = await this.prisma.user.findMany({
            where: {
                active: true,
                OR: [{ email: normalized }, { username: normalized }],
                tenant: { active: true },
            },
            include: { tenant: { select: { domain: true, subdomain: true } } },
        });
        const verified = [];
        for (const candidate of candidates) {
            if (await bcrypt.compare(password, candidate.passwordHash)) {
                verified.push(candidate);
            }
        }
        let user = verified.length === 1 ? verified[0] : null;
        if (!user && verified.length > 1 && host) {
            const domain = host.split(':')[0];
            const byHost = verified.filter((u) => u.tenant.domain === domain ||
                (u.tenant.subdomain && domain.startsWith(`${u.tenant.subdomain}.`)));
            if (byHost.length === 1)
                user = byHost[0];
        }
        if (!user) {
            throw new common_1.UnauthorizedException(verified.length > 1
                ? 'Birden fazla hesap eşleşti — lütfen size verilen panel adresinden giriş yapın'
                : 'Invalid credentials');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const { passwordHash, tenant, ...result } = user;
        return result;
    }
    login(user, rememberMe = false) {
        const payload = {
            sub: user.id,
            tenantId: user.tenantId,
            role: user.role,
        };
        return {
            accessToken: this.jwtService.sign(payload, {
                expiresIn: rememberMe ? '30d' : '1d',
            }),
            tenantId: user.tenantId,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        };
    }
    async register(tenantId, dto) {
        const existing = await this.prisma.user.findFirst({
            where: { tenantId, email: dto.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                tenantId,
                email: dto.email,
                username: dto.username,
                passwordHash,
                name: dto.name,
                role: 'REPORTER',
            },
        });
        const { passwordHash: _, ...userWithoutPassword } = user;
        return this.login(userWithoutPassword);
    }
    logger = new common_1.Logger(AuthService_1.name);
    async createPasswordResetToken(tenantId, email) {
        const user = await this.prisma.user.findFirst({
            where: { tenantId, email: email.trim().toLowerCase(), active: true },
        });
        if (!user)
            return { ok: true };
        const token = (0, crypto_1.randomBytes)(32).toString('base64url');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetTokenHash: tokenHash,
                passwordResetExpiresAt: expiresAt,
            },
        });
        if (process.env.NODE_ENV !== 'production') {
            this.logger.log(`[DEV] Password reset for ${email}: token=${token} (expires ${expiresAt.toISOString()})`);
        }
        return { ok: true, token };
    }
    async resetPasswordWithToken(token, newPassword) {
        if (!token || newPassword.length < 6) {
            throw new common_1.BadRequestException('Geçersiz token veya şifre');
        }
        const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const user = await this.prisma.user.findFirst({
            where: {
                passwordResetTokenHash: tokenHash,
                passwordResetExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token geçersiz veya süresi dolmuş');
        }
        const passwordHash = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash,
                passwordResetTokenHash: null,
                passwordResetExpiresAt: null,
            },
        });
        return { ok: true };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map