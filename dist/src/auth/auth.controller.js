"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const roles_guard_1 = require("./guards/roles.guard");
const auth_service_1 = require("./auth.service");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthController = class AuthController {
    authService;
    prisma;
    constructor(authService, prisma) {
        this.authService = authService;
        this.prisma = prisma;
    }
    async login(dto, tenantIdHeader, host) {
        const user = await this.authService.validateUserFlexible(dto.identifier, dto.password, tenantIdHeader || undefined, host);
        return this.authService.login(user, dto.rememberMe ?? false);
    }
    async forgotPassword(tenantId, body) {
        const { token } = await this.authService.createPasswordResetToken(tenantId, body.email);
        return { ok: true, ...(process.env.NODE_ENV !== 'production' && { devToken: token }) };
    }
    async resetPassword(body) {
        return this.authService.resetPasswordWithToken(body.token, body.password);
    }
    async register(tenantId, dto) {
        return this.authService.register(tenantId, dto);
    }
    async me(req) {
        const user = await this.prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                avatar: true,
                tenantId: true,
            },
        });
        return { user };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, common_1.Post)('login'),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-tenant-id')),
    __param(2, (0, common_1.Headers)('host')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    openapi.ApiOperation({ summary: "\u015Eifremi unuttum \u2014 e-postaya s\u0131f\u0131rlama token\u0131 g\u00F6nderir. Anonim, throttled.\nG\u00FCvenlik: e-posta var/yok bilgisini s\u0131zd\u0131rmamak i\u00E7in her zaman `ok:true`." }),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: 60_000 } }),
    (0, common_1.Post)('forgot-password'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    openapi.ApiOperation({ summary: "Token ile \u015Fifre s\u0131f\u0131rla \u2014 token bir kez kullan\u0131labilir." }),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    (0, common_1.Post)('reset-password'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    openapi.ApiOperation({ summary: "Yeni kullan\u0131c\u0131 kayd\u0131 \u2014 anonim internet kullan\u0131c\u0131lar\u0131na A\u00C7IK DE\u011E\u0130L.\nYaln\u0131zca ADMIN ve \u00FCst\u00FC, kendi tenant'lar\u0131 i\u00E7in yeni hesap olu\u015Fturabilir.\nGenel ama\u00E7l\u0131 hesap yaratma `POST /users` \u00FCzerinden yap\u0131l\u0131r; bu u\u00E7,\nonboarding s\u0131ras\u0131nda ilk admin olu\u015Fturmak i\u00E7in kullan\u0131l\u0131r." }),
    (0, common_1.Post)('register'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 201, type: require("./dto/auth-response.dto").AuthResponseDto }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, register_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('api/auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        prisma_service_1.PrismaService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map