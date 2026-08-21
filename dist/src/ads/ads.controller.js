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
exports.AdsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const ads_service_1 = require("./ads.service");
const create_ad_dto_1 = require("./dto/create-ad.dto");
const update_ad_dto_1 = require("./dto/update-ad.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const client_1 = require("@prisma/client");
let AdsController = class AdsController {
    adsService;
    constructor(adsService) {
        this.adsService = adsService;
    }
    findByPosition(tenantId, position) {
        return this.adsService.findByPosition(tenantId, position);
    }
    findAll(tenantId) {
        return this.adsService.findAll(tenantId);
    }
    create(tenantId, dto) {
        return this.adsService.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.adsService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.adsService.remove(tenantId, id);
    }
    trackImpression(tenantId, id) {
        return this.adsService.trackImpression(tenantId, id);
    }
    trackClick(tenantId, id) {
        return this.adsService.trackClick(tenantId, id);
    }
};
exports.AdsController = AdsController;
__decorate([
    openapi.ApiParam({ name: "position", enum: ["HEADER_ABOVE", "HEADER_TOP", "FOOTER_BOTTOM", "SITE_TOWER_LEFT", "SITE_TOWER_RIGHT", "HOME_SLIDER_UNDER", "HOME_SLIDER_INSIDE", "HOME_MIDDLE_1", "HOME_MIDDLE_2", "HOME_MIDDLE_3", "HOME_MIDDLE_4", "HOME_BOTTOM", "CATEGORY_MIDDLE_1", "CATEGORY_MIDDLE_2", "ARTICLE_TOP", "ARTICLE_IN_TEXT_1", "ARTICLE_BOTTOM", "ARTICLE_SIDEBAR_1", "ARTICLE_SIDEBAR_2", "VIDEO_LIST_TOP", "VIDEO_LIST_BOTTOM", "VIDEO_DETAIL_TOP"] }),
    (0, common_1.Get)('position/:position'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findByPosition", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_ad_dto_1.CreateAdDto]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_ad_dto_1.UpdateAdDto]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/impression'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "trackImpression", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsController.prototype, "trackClick", null);
exports.AdsController = AdsController = __decorate([
    (0, common_1.Controller)('api/ads'),
    __metadata("design:paramtypes", [ads_service_1.AdsService])
], AdsController);
//# sourceMappingURL=ads.controller.js.map