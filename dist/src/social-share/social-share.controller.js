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
exports.SocialShareController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const create_article_dto_1 = require("../articles/dto/create-article.dto");
const social_share_service_1 = require("./social-share.service");
class SinamaDto {
    ag;
}
__decorate([
    (0, class_validator_1.IsIn)(create_article_dto_1.PAYLASIM_AGLARI),
    __metadata("design:type", String)
], SinamaDto.prototype, "ag", void 0);
let SocialShareController = class SocialShareController {
    socialShare;
    constructor(socialShare) {
        this.socialShare = socialShare;
    }
    sina(tenantId, dto) {
        return this.socialShare.baglantiyiSina(tenantId, dto.ag);
    }
};
exports.SocialShareController = SocialShareController;
__decorate([
    (0, common_1.Post)('test'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, SinamaDto]),
    __metadata("design:returntype", void 0)
], SocialShareController.prototype, "sina", null);
exports.SocialShareController = SocialShareController = __decorate([
    (0, common_1.Controller)('api/social-share'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [social_share_service_1.SocialShareService])
], SocialShareController);
//# sourceMappingURL=social-share.controller.js.map