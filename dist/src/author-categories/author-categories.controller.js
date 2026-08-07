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
exports.AuthorCategoriesController = void 0;
const common_1 = require("@nestjs/common");
const author_categories_service_1 = require("./author-categories.service");
const create_author_category_dto_1 = require("./dto/create-author-category.dto");
const update_author_category_dto_1 = require("./dto/update-author-category.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
let AuthorCategoriesController = class AuthorCategoriesController {
    authorCategoriesService;
    constructor(authorCategoriesService) {
        this.authorCategoriesService = authorCategoriesService;
    }
    findAll(tenantId) {
        return this.authorCategoriesService.findAll(tenantId);
    }
    findOne(tenantId, id) {
        return this.authorCategoriesService.findOne(tenantId, id);
    }
    create(tenantId, dto) {
        return this.authorCategoriesService.create(tenantId, dto);
    }
    reorder(tenantId, body) {
        return this.authorCategoriesService.reorder(tenantId, body.items);
    }
    update(tenantId, id, dto) {
        return this.authorCategoriesService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.authorCategoriesService.remove(tenantId, id);
    }
};
exports.AuthorCategoriesController = AuthorCategoriesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_author_category_dto_1.CreateAuthorCategoryDto]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)('reorder'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "reorder", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_author_category_dto_1.UpdateAuthorCategoryDto]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AuthorCategoriesController.prototype, "remove", null);
exports.AuthorCategoriesController = AuthorCategoriesController = __decorate([
    (0, common_1.Controller)('api/author-categories'),
    __metadata("design:paramtypes", [author_categories_service_1.AuthorCategoriesService])
], AuthorCategoriesController);
//# sourceMappingURL=author-categories.controller.js.map