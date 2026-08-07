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
exports.BreakingNewsController = void 0;
const common_1 = require("@nestjs/common");
const breaking_news_service_1 = require("./breaking-news.service");
const create_breaking_news_dto_1 = require("./dto/create-breaking-news.dto");
const update_breaking_news_dto_1 = require("./dto/update-breaking-news.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let BreakingNewsController = class BreakingNewsController {
    breakingNewsService;
    constructor(breakingNewsService) {
        this.breakingNewsService = breakingNewsService;
    }
    findActive(tenantId) {
        return this.breakingNewsService.findActive(tenantId);
    }
    findAll(tenantId) {
        return this.breakingNewsService.findAll(tenantId);
    }
    reorder(tenantId, body) {
        return this.breakingNewsService.reorder(tenantId, body.ids ?? []);
    }
    create(tenantId, dto) {
        return this.breakingNewsService.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.breakingNewsService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.breakingNewsService.remove(tenantId, id);
    }
};
exports.BreakingNewsController = BreakingNewsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "findActive", null);
__decorate([
    (0, common_1.Get)('all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "reorder", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_breaking_news_dto_1.CreateBreakingNewsDto]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_breaking_news_dto_1.UpdateBreakingNewsDto]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], BreakingNewsController.prototype, "remove", null);
exports.BreakingNewsController = BreakingNewsController = __decorate([
    (0, common_1.Controller)('api/breaking-news'),
    __metadata("design:paramtypes", [breaking_news_service_1.BreakingNewsService])
], BreakingNewsController);
//# sourceMappingURL=breaking-news.controller.js.map