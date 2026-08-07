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
exports.NewslettersController = void 0;
const common_1 = require("@nestjs/common");
const newsletters_service_1 = require("./newsletters.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let NewslettersController = class NewslettersController {
    newslettersService;
    constructor(newslettersService) {
        this.newslettersService = newslettersService;
    }
    subscribe(tenantId, body) {
        return this.newslettersService.subscribe(tenantId, body.email, body.name);
    }
    unsubscribe(tenantId, body) {
        return this.newslettersService.unsubscribe(tenantId, body.email);
    }
    findAll(tenantId) {
        return this.newslettersService.findAll(tenantId);
    }
    getCount(tenantId) {
        return this.newslettersService.getCount(tenantId);
    }
};
exports.NewslettersController = NewslettersController;
__decorate([
    (0, common_1.Post)('subscribe'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "getCount", null);
exports.NewslettersController = NewslettersController = __decorate([
    (0, common_1.Controller)('api/newsletters'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [newsletters_service_1.NewslettersService])
], NewslettersController);
//# sourceMappingURL=newsletters.controller.js.map