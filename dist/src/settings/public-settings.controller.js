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
exports.PublicSettingsController = void 0;
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const settings_service_1 = require("./settings.service");
const SENSITIVE_KEYS = ['oneSignalAppId', 'appStoreUrl', 'playStoreUrl'];
let PublicSettingsController = class PublicSettingsController {
    settingsService;
    constructor(settingsService) {
        this.settingsService = settingsService;
    }
    async getPublic(tenantId) {
        const all = await this.settingsService.getAll(tenantId);
        for (const key of SENSITIVE_KEYS) {
            delete all[key];
        }
        return all;
    }
};
exports.PublicSettingsController = PublicSettingsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicSettingsController.prototype, "getPublic", null);
exports.PublicSettingsController = PublicSettingsController = __decorate([
    (0, common_1.Controller)('api/public/settings'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService])
], PublicSettingsController);
//# sourceMappingURL=public-settings.controller.js.map