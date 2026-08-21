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
exports.SettingsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const settings_service_1 = require("./settings.service");
const secret_box_1 = require("../common/crypto/secret-box");
const update_settings_dto_1 = require("./dto/update-settings.dto");
let SettingsController = class SettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    getAll(tenantId) {
        return this.settingsService.getAll(tenantId);
    }
    getSecretStatus(tenantId) {
        return this.settingsService.getSecretStatus(tenantId);
    }
    getEncryptionStatus() {
        return { ready: (0, secret_box_1.isEncryptionConfigured)() };
    }
    get(tenantId, key) {
        return this.settingsService.get(tenantId, key);
    }
    bulkUpsert(tenantId, dto) {
        return this.settingsService.bulkUpsert(tenantId, dto.settings);
    }
    upsert(tenantId, key, dto) {
        return this.settingsService.upsert(tenantId, key, dto.value);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getAll", null);
__decorate([
    openapi.ApiOperation({ summary: "Gizli ayarlar\u0131n yaln\u0131zca DURUMU \u2014 de\u011Ferleri de\u011Fil.\n\n`getAll` s\u0131rlar\u0131 hi\u00E7 d\u00F6nd\u00FCrmedi\u011Fi i\u00E7in panelin \"API anahtar\u0131 kay\u0131tl\u0131 m\u0131\"\nsorusuna cevap verecek ayr\u0131 bir uca ihtiyac\u0131 var. D\u00F6nen tek \u015Fey\n`{ configured, hint }`; anahtar\u0131n kendisi taray\u0131c\u0131ya inmiyor.\n\n`:key` rotas\u0131ndan \u00D6NCE tan\u0131ml\u0131 olmal\u0131 \u2014 aksi halde \"secret-status\" bir\nayar ad\u0131 san\u0131l\u0131p oraya d\u00FC\u015Fer." }),
    (0, common_1.Get)('secret-status'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getSecretStatus", null);
__decorate([
    openapi.ApiOperation({ summary: "Sunucu s\u0131r saklayabilecek durumda m\u0131 \u2014 `SETTINGS_ENCRYPTION_KEY` tan\u0131ml\u0131 m\u0131.\n\nAnahtar\u0131n kendisi hakk\u0131nda hi\u00E7bir bilgi vermiyor, yaln\u0131zca \"haz\u0131r m\u0131\"\ndiyor; yine de y\u00F6netici korumas\u0131n\u0131n arkas\u0131nda duruyor.\n\nNeden var: anahtar tan\u0131ml\u0131 de\u011Filken API anahtar\u0131 kaydetmek 400 d\u00F6n\u00FCyor ve\nkullan\u0131c\u0131 bunu ancak formu doldurup kaydete bast\u0131ktan SONRA \u00F6\u011Freniyor.\nU\u00E7tan uca testlerde de ayn\u0131 durum, \u00FCr\u00FCn bozuk olmad\u0131\u011F\u0131 h\u00E2lde anla\u015F\u0131lmaz\nbir k\u0131r\u0131lma olarak g\u00F6r\u00FCn\u00FCyordu; test kurulumu art\u0131k bunu \u00F6nden yoklay\u0131p\nne yap\u0131lmas\u0131 gerekti\u011Fini s\u00F6yl\u00FCyor.\n\n`:key` rotas\u0131ndan \u00D6NCE tan\u0131ml\u0131 olmal\u0131." }),
    (0, common_1.Get)('encryption-status'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "getEncryptionStatus", null);
__decorate([
    (0, common_1.Get)(':key'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_settings_dto_1.BulkUpdateSettingsDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "bulkUpsert", null);
__decorate([
    (0, common_1.Put)(':key'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('key')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_settings_dto_1.UpdateSettingDto]),
    __metadata("design:returntype", void 0)
], SettingsController.prototype, "upsert", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('api/settings'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map