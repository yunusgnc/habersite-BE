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
exports.WidgetsController = void 0;
const common_1 = require("@nestjs/common");
const widgets_service_1 = require("./widgets.service");
const widget_feeder_service_1 = require("./widget-feeder.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let WidgetsController = class WidgetsController {
    widgetsService;
    feeder;
    constructor(widgetsService, feeder) {
        this.widgetsService = widgetsService;
        this.feeder = feeder;
    }
    refresh(tenantId, type) {
        return this.feeder.refreshOne(tenantId, type);
    }
    findActive(tenantId) {
        return this.widgetsService.findActive(tenantId);
    }
    findAll(tenantId) {
        return this.widgetsService.findAll(tenantId);
    }
    findByType(tenantId, type) {
        return this.widgetsService.findByType(tenantId, type);
    }
    upsert(tenantId, type, data) {
        return this.widgetsService.upsert(tenantId, type, data);
    }
    remove(tenantId, type) {
        return this.widgetsService.remove(tenantId, type);
    }
};
exports.WidgetsController = WidgetsController;
__decorate([
    (0, common_1.Post)(':type/refresh'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "refresh", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':type'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "findByType", null);
__decorate([
    (0, common_1.Put)(':type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "upsert", null);
__decorate([
    (0, common_1.Delete)(':type'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], WidgetsController.prototype, "remove", null);
exports.WidgetsController = WidgetsController = __decorate([
    (0, common_1.Controller)('api/widgets'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [widgets_service_1.WidgetsService,
        widget_feeder_service_1.WidgetFeederService])
], WidgetsController);
//# sourceMappingURL=widgets.controller.js.map