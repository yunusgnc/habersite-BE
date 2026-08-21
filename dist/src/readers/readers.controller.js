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
exports.ReadersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const readers_service_1 = require("./readers.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const reader_jwt_guard_1 = require("./reader-jwt.guard");
const user_decorator_1 = require("../common/decorators/user.decorator");
const reader_dto_1 = require("./dto/reader.dto");
let ReadersController = class ReadersController {
    service;
    constructor(service) {
        this.service = service;
    }
    register(tenantId, dto) {
        return this.service.register(tenantId, dto);
    }
    login(tenantId, dto) {
        return this.service.login(tenantId, dto);
    }
    me(user) {
        return this.service.me(user.readerId);
    }
    updateMe(user, dto) {
        return this.service.updateMe(user.readerId, dto);
    }
    listBookmarks(user) {
        return this.service.listBookmarks(user.readerId, user.tenantId);
    }
    addBookmark(user, body) {
        return this.service.addBookmark(user.readerId, user.tenantId, body.articleId);
    }
    removeBookmark(user, articleId) {
        return this.service.removeBookmark(user.readerId, articleId);
    }
    check(user, articleId) {
        return this.service.isBookmarked(user.readerId, articleId);
    }
};
exports.ReadersController = ReadersController;
__decorate([
    (0, common_1.Post)('register'),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60_000 } }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reader_dto_1.RegisterReaderDto]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60_000 } }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reader_dto_1.LoginReaderDto]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "me", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reader_dto_1.UpdateReaderDto]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "updateMe", null);
__decorate([
    (0, common_1.Get)('bookmarks'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "listBookmarks", null);
__decorate([
    (0, common_1.Post)('bookmarks'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "addBookmark", null);
__decorate([
    (0, common_1.Delete)('bookmarks/:articleId'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "removeBookmark", null);
__decorate([
    (0, common_1.Get)('bookmarks/check'),
    (0, common_1.UseGuards)(reader_jwt_guard_1.ReaderJwtGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('articleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReadersController.prototype, "check", null);
exports.ReadersController = ReadersController = __decorate([
    (0, common_1.Controller)('api/readers'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [readers_service_1.ReadersService])
], ReadersController);
//# sourceMappingURL=readers.controller.js.map