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
exports.CartoonsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cartoons_service_1 = require("./cartoons.service");
const create_cartoon_dto_1 = require("./dto/create-cartoon.dto");
const update_cartoon_dto_1 = require("./dto/update-cartoon.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let CartoonsController = class CartoonsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findPublic(tenantId, limit, cursor, page, artist, search) {
        return this.service.findPublic(tenantId, {
            limit: sayi(limit),
            cursor,
            page: sayi(page),
            artist,
            search,
        });
    }
    artists(tenantId) {
        return this.service.artists(tenantId);
    }
    sitemap(tenantId) {
        return this.service.sitemap(tenantId);
    }
    findBySlug(tenantId, slug) {
        return this.service.findBySlug(tenantId, slug);
    }
    neighbours(tenantId, slug) {
        return this.service.neighbours(tenantId, slug);
    }
    findAll(tenantId, limit, cursor, search) {
        return this.service.findAll(tenantId, { limit: sayi(limit), cursor, search });
    }
    stats(tenantId) {
        return this.service.stats(tenantId);
    }
    findOne(tenantId, id) {
        return this.service.findOne(tenantId, id);
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
};
exports.CartoonsController = CartoonsController;
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "artist", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)('public'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('artist')),
    __param(5, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('public/artists'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "artists", null);
__decorate([
    (0, common_1.Get)('public/sitemap'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "sitemap", null);
__decorate([
    (0, common_1.Get)('public/:slug'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)('public/:slug/neighbours'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "neighbours", null);
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_cartoon_dto_1.CreateCartoonDto]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR', 'REPORTER'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_cartoon_dto_1.UpdateCartoonDto]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartoonsController.prototype, "remove", null);
exports.CartoonsController = CartoonsController = __decorate([
    (0, common_1.Controller)('api/cartoons'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [cartoons_service_1.CartoonsService])
], CartoonsController);
function sayi(value) {
    if (!value)
        return undefined;
    const n = parseInt(value, 10);
    return Number.isFinite(n) ? n : undefined;
}
//# sourceMappingURL=cartoons.controller.js.map