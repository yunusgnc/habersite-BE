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
exports.OfficialNoticesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const official_notices_service_1 = require("./official-notices.service");
const create_official_notice_dto_1 = require("./dto/create-official-notice.dto");
const update_official_notice_dto_1 = require("./dto/update-official-notice.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let OfficialNoticesController = class OfficialNoticesController {
    service;
    constructor(service) {
        this.service = service;
    }
    findPublic(tenantId, limit, cursor, noticeType, institution, search, archived) {
        return this.service.findPublic(tenantId, {
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
            noticeType: parseNoticeType(noticeType),
            institution,
            search,
            archived: archived === 'true',
        });
    }
    institutions(tenantId) {
        return this.service.institutions(tenantId);
    }
    findBySlug(tenantId, slug) {
        return this.service.findBySlug(tenantId, slug);
    }
    findAll(tenantId, limit, cursor, noticeType, search) {
        return this.service.findAll(tenantId, {
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
            noticeType: parseNoticeType(noticeType),
            search,
        });
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
exports.OfficialNoticesController = OfficialNoticesController;
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "noticeType", required: false }),
    openapi.ApiQuery({ name: "institution", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "archived", required: false }),
    (0, common_1.Get)('public'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('noticeType')),
    __param(4, (0, common_1.Query)('institution')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('archived')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "findPublic", null);
__decorate([
    (0, common_1.Get)('public/institutions'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "institutions", null);
__decorate([
    (0, common_1.Get)('public/:slug'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "findBySlug", null);
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "noticeType", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('noticeType')),
    __param(4, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_official_notice_dto_1.CreateOfficialNoticeDto]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_official_notice_dto_1.UpdateOfficialNoticeDto]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], OfficialNoticesController.prototype, "remove", null);
exports.OfficialNoticesController = OfficialNoticesController = __decorate([
    (0, common_1.Controller)('api/official-notices'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [official_notices_service_1.OfficialNoticesService])
], OfficialNoticesController);
function parseNoticeType(value) {
    if (!value)
        return undefined;
    return Object.values(client_1.NoticeType).includes(value)
        ? value
        : undefined;
}
//# sourceMappingURL=official-notices.controller.js.map