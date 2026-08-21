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
exports.AiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const ai_service_1 = require("./ai.service");
const assist_dto_1 = require("./dto/assist.dto");
let AiController = class AiController {
    ai;
    constructor(ai) {
        this.ai = ai;
    }
    status(tenantId) {
        return this.ai.status(tenantId);
    }
    assist(tenantId, dto) {
        return this.ai.assist(tenantId, dto.task, {
            title: dto.title,
            content: dto.content,
            spot: dto.spot,
        });
    }
};
exports.AiController = AiController;
__decorate([
    openapi.ApiOperation({ summary: "Yard\u0131mc\u0131lar a\u00E7\u0131k m\u0131 \u2014 panel butonlar\u0131 buna g\u00F6re g\u00F6steriliyor.\n\nOran s\u0131n\u0131r\u0131n\u0131n d\u0131\u015F\u0131nda tutuldu: sayfa a\u00E7\u0131l\u0131\u015F\u0131nda \u00E7a\u011Fr\u0131l\u0131yor ve sa\u011Flay\u0131c\u0131ya\ngitmiyor, yaln\u0131zca ayara bak\u0131yor. As\u0131l s\u0131n\u0131r `assist` \u00FCzerinde." }),
    (0, common_1.Get)('status'),
    (0, throttler_1.Throttle)({ default: { limit: 60, ttl: 60_000 } }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "status", null);
__decorate([
    (0, common_1.Post)('assist'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, assist_dto_1.AssistDto]),
    __metadata("design:returntype", void 0)
], AiController.prototype, "assist", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('api/ai'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], AiController);
//# sourceMappingURL=ai.controller.js.map