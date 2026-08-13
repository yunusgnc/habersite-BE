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
exports.PersonProfilesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const person_profiles_service_1 = require("./person-profiles.service");
const create_person_profile_dto_1 = require("./dto/create-person-profile.dto");
const update_person_profile_dto_1 = require("./dto/update-person-profile.dto");
let PersonProfilesController = class PersonProfilesController {
    personProfilesService;
    constructor(personProfilesService) {
        this.personProfilesService = personProfilesService;
    }
    findAll(tenantId, cursor, limit, search) {
        return this.personProfilesService.findAll(tenantId, {
            cursor,
            limit: limit ? parseInt(limit, 10) : undefined,
            search,
        });
    }
    findBySlug(tenantId, slug) {
        return this.personProfilesService.findBySlug(tenantId, slug);
    }
    findOne(tenantId, id) {
        return this.personProfilesService.findOne(tenantId, id);
    }
    create(tenantId, dto) {
        return this.personProfilesService.create(tenantId, dto);
    }
    update(tenantId, id, dto) {
        return this.personProfilesService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.personProfilesService.remove(tenantId, id);
    }
};
exports.PersonProfilesController = PersonProfilesController;
__decorate([
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('cursor')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], PersonProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('slug/:slug'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonProfilesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PersonProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_person_profile_dto_1.CreatePersonProfileDto]),
    __metadata("design:returntype", void 0)
], PersonProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_person_profile_dto_1.UpdatePersonProfileDto]),
    __metadata("design:returntype", void 0)
], PersonProfilesController.prototype, "update", null);
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
], PersonProfilesController.prototype, "remove", null);
exports.PersonProfilesController = PersonProfilesController = __decorate([
    (0, common_1.Controller)('api/person-profiles'),
    __metadata("design:paramtypes", [person_profiles_service_1.PersonProfilesService])
], PersonProfilesController);
//# sourceMappingURL=person-profiles.controller.js.map