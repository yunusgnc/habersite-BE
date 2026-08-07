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
exports.ContactMessagesController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const contact_messages_service_1 = require("./contact-messages.service");
const create_contact_message_dto_1 = require("./dto/create-contact-message.dto");
let ContactMessagesController = class ContactMessagesController {
    service;
    constructor(service) {
        this.service = service;
    }
    create(tenantId, dto, ip, req) {
        return this.service.create(tenantId, dto, {
            ipAddress: ip,
            userAgent: req.headers?.['user-agent'],
        });
    }
    findAll(tenantId, limit, cursor, unreadOnly) {
        return this.service.findAll(tenantId, {
            limit: limit ? parseInt(limit, 10) : undefined,
            cursor,
            unreadOnly: unreadOnly === 'true',
        });
    }
    stats(tenantId) {
        return this.service.stats(tenantId);
    }
    markRead(tenantId, id, read) {
        return this.service.markRead(tenantId, id, read !== false);
    }
    remove(tenantId, id) {
        return this.service.remove(tenantId, id);
    }
};
exports.ContactMessagesController = ContactMessagesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Ip)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_contact_message_dto_1.CreateContactMessageDto, String, Object]),
    __metadata("design:returntype", void 0)
], ContactMessagesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('cursor')),
    __param(3, (0, common_1.Query)('unreadOnly')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], ContactMessagesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ContactMessagesController.prototype, "stats", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN', 'EDITOR'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('read')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean]),
    __metadata("design:returntype", void 0)
], ContactMessagesController.prototype, "markRead", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'SUPER_ADMIN'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ContactMessagesController.prototype, "remove", null);
exports.ContactMessagesController = ContactMessagesController = __decorate([
    (0, common_1.Controller)('api/contact-messages'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [contact_messages_service_1.ContactMessagesService])
], ContactMessagesController);
//# sourceMappingURL=contact-messages.controller.js.map