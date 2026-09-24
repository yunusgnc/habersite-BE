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
exports.MediaController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const media_service_1 = require("./media.service");
const upload_media_dto_1 = require("./dto/upload-media.dto");
const query_media_dto_1 = require("./dto/query-media.dto");
let MediaController = class MediaController {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    findAll(tenantId, query) {
        return this.mediaService.findAll(tenantId, query);
    }
    upload(tenantId, file, dto) {
        return this.mediaService.create(tenantId, file, dto);
    }
    async ham(tenantId, id, res) {
        const { govde, mimeType } = await this.mediaService.hamIcerik(tenantId, id);
        res.set({
            'Content-Type': mimeType,
            'Cache-Control': 'no-store',
        });
        return new common_1.StreamableFile(govde);
    }
    kirp(tenantId, id, file) {
        return this.mediaService.kirpilaniUygula(tenantId, id, file);
    }
    update(tenantId, id, dto) {
        return this.mediaService.update(tenantId, id, dto);
    }
    remove(tenantId, id) {
        return this.mediaService.remove(tenantId, id);
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_media_dto_1.QueryMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, upload_media_dto_1.UploadMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "upload", null);
__decorate([
    openapi.ApiOperation({ summary: "Yeniden k\u0131rpma ekran\u0131n\u0131n okudu\u011Fu ham g\u00F6rsel. M\u00FC\u015Fterinin CDN'i CORS\nba\u015Fl\u0131\u011F\u0131 g\u00F6ndermedi\u011Fi i\u00E7in taray\u0131c\u0131 o adresi tuvale \u00E7izemiyor; baytlar\u0131\nburadan ge\u00E7irince panel g\u00F6rseli kendi origin'indeymi\u015F gibi i\u015Fleyebiliyor." }),
    (0, common_1.Get)(':id/ham'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "ham", null);
__decorate([
    openapi.ApiOperation({ summary: "Yeniden k\u0131rp\u0131lm\u0131\u015F g\u00F6rseli mevcut kayd\u0131n yerine koyar ve adresi ge\u00E7en t\u00FCm\nkay\u0131tlar\u0131 g\u00FCnceller. Yaln\u0131zca i\u00E7erik \u00FCzerinde yetkisi olan roller." }),
    (0, common_1.Post)(':id/kirp'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "kirp", null);
__decorate([
    (0, common_1.Patch)(':id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, upload_media_dto_1.UploadMediaDto]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MediaController.prototype, "remove", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('api/media'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map