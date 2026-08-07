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
exports.RedirectsController = void 0;
const common_1 = require("@nestjs/common");
const redirects_service_1 = require("./redirects.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let RedirectsController = class RedirectsController {
    redirectsService;
    constructor(redirectsService) {
        this.redirectsService = redirectsService;
    }
    findAll(tenantId) {
        return this.redirectsService.findAll(tenantId);
    }
    create(tenantId, data) {
        return this.redirectsService.create(tenantId, data);
    }
    createMany(tenantId, data) {
        return this.redirectsService.createMany(tenantId, data.redirects);
    }
    remove(tenantId, id) {
        return this.redirectsService.remove(tenantId, id);
    }
};
exports.RedirectsController = RedirectsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RedirectsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RedirectsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('bulk'),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RedirectsController.prototype, "createMany", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RedirectsController.prototype, "remove", null);
exports.RedirectsController = RedirectsController = __decorate([
    (0, common_1.Controller)('api/redirects'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [redirects_service_1.RedirectsService])
], RedirectsController);
//# sourceMappingURL=redirects.controller.js.map