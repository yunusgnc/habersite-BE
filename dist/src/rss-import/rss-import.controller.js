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
exports.RssImportController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const rss_import_service_1 = require("./rss-import.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const rss_source_dto_1 = require("./dto/rss-source.dto");
let RssImportController = class RssImportController {
    service;
    constructor(service) {
        this.service = service;
    }
    list(tenantId) {
        return this.service.list(tenantId);
    }
    get(tenantId, id) {
        return this.service.get(tenantId, id);
    }
    create(tenantId, dto) {
        return this.service.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.service.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.service.remove(tenantId, id);
    }
    fetch(tenantId, id) {
        return this.service.fetchOne(tenantId, id);
    }
};
exports.RssImportController = RssImportController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, rss_source_dto_1.CreateRssSourceDto]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, rss_source_dto_1.UpdateRssSourceDto]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "remove", null);
__decorate([
    openapi.ApiOperation({ summary: "Manuel tetikleyici \u2014 cron'u beklemeden hemen \u00E7ek" }),
    (0, common_1.Post)(':id/fetch'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], RssImportController.prototype, "fetch", null);
exports.RssImportController = RssImportController = __decorate([
    (0, common_1.Controller)('api/rss-sources'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [rss_import_service_1.RssImportService])
], RssImportController);
//# sourceMappingURL=rss-import.controller.js.map