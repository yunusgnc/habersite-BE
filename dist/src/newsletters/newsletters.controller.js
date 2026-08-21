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
exports.NewslettersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const newsletters_service_1 = require("./newsletters.service");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
const newsletter_campaign_dto_1 = require("./dto/newsletter-campaign.dto");
let NewslettersController = class NewslettersController {
    newslettersService;
    constructor(newslettersService) {
        this.newslettersService = newslettersService;
    }
    subscribe(tenantId, body) {
        return this.newslettersService.subscribe(tenantId, body.email, body.name);
    }
    unsubscribe(tenantId, body) {
        return this.newslettersService.unsubscribe(tenantId, body.email);
    }
    findAll(tenantId) {
        return this.newslettersService.findAll(tenantId);
    }
    getCount(tenantId) {
        return this.newslettersService.getCount(tenantId);
    }
    remove(tenantId, id) {
        return this.newslettersService.remove(tenantId, id);
    }
    listCampaigns(tenantId, query) {
        return this.newslettersService.listCampaigns(tenantId, query);
    }
    getCampaign(tenantId, id) {
        return this.newslettersService.getCampaign(tenantId, id);
    }
    createCampaign(tenantId, user, dto) {
        return this.newslettersService.createCampaign(tenantId, user?.id ?? null, dto);
    }
    updateCampaign(tenantId, id, dto) {
        return this.newslettersService.updateCampaign(tenantId, id, dto);
    }
    removeCampaign(tenantId, id) {
        return this.newslettersService.removeCampaign(tenantId, id);
    }
    sendCampaign(tenantId, id, body = {}) {
        return this.newslettersService.sendCampaign(tenantId, id, body.dryRun !== false);
    }
};
exports.NewslettersController = NewslettersController;
__decorate([
    (0, common_1.Post)('subscribe'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Post)('unsubscribe'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200, type: Number }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "getCount", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, newsletter_campaign_dto_1.ListCampaignsQuery]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "listCampaigns", null);
__decorate([
    (0, common_1.Get)('campaigns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.Post)('campaigns'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, newsletter_campaign_dto_1.CreateCampaignDto]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.Patch)('campaigns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, newsletter_campaign_dto_1.UpdateCampaignDto]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "updateCampaign", null);
__decorate([
    (0, common_1.Delete)('campaigns/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "removeCampaign", null);
__decorate([
    openapi.ApiOperation({ summary: "G\u00F6nderim tetikleyicisi. SMTP altyap\u0131s\u0131 hen\u00FCz yok; dryRun=true default\nmodunda sadece ka\u00E7 aboneye gidece\u011Fini bildirir. dryRun=false \u00E7a\u011Fr\u0131s\u0131\ndurum g\u00FCncellemesi yapar ama posta g\u00F6ndermez (SMTP entegrasyonu ileride\nbu handler'\u0131n i\u00E7ine BullMQ job'u olarak eklenecek)." }),
    (0, common_1.Post)('campaigns/:id/send'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], NewslettersController.prototype, "sendCampaign", null);
exports.NewslettersController = NewslettersController = __decorate([
    (0, common_1.Controller)('api/newsletters'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [newsletters_service_1.NewslettersService])
], NewslettersController);
//# sourceMappingURL=newsletters.controller.js.map