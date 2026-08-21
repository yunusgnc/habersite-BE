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
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const settings_service_1 = require("./settings.service");
const prisma_service_1 = require("../prisma/prisma.service");
const secret_settings_1 = require("./secret-settings");
const SENSITIVE_KEYS = [
    'oneSignalAppId',
    'appStoreUrl',
    'playStoreUrl',
    'aiProvider',
];
let PublicSettingsController = class PublicSettingsController {
    settingsService;
    prisma;
    constructor(settingsService, prisma) {
        this.settingsService = settingsService;
        this.prisma = prisma;
    }
    async getPublic(tenantId) {
        const [all, tenant] = await Promise.all([
            this.settingsService.getAll(tenantId),
            this.prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { name: true, locale: true, timezone: true },
            }),
        ]);
        for (const key of SENSITIVE_KEYS) {
            delete all[key];
        }
        for (const key of secret_settings_1.SECRET_SETTING_KEYS) {
            delete all[key];
        }
        if (!all.siteTitle && tenant?.name)
            all.siteTitle = tenant.name;
        if (tenant?.locale)
            all.locale = tenant.locale;
        if (tenant?.timezone)
            all.timezone = tenant.timezone;
        return all;
    }
};
exports.PublicSettingsController = PublicSettingsController;
__decorate([
    openapi.ApiOperation({ summary: "Herkese a\u00E7\u0131k ayarlar. Tenant'\u0131n meta bilgisini de (locale, timezone,\nname) buraya kat\u0131yoruz \u2014 site taraf\u0131 `html lang`, JSON-LD ve Google\nNews sitemap i\u00E7in ihtiya\u00E7 duyuyor. Bu de\u011Ferler `Tenant` modelinde ayr\u0131\nkolonlar olarak duruyor, `settings` tablosunda de\u011Fil.\n\nHassas anahtarlar (oneSignal, ma\u011Faza URL'leri) \u00E7\u0131kar\u0131l\u0131r." }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicSettingsController.prototype, "getPublic", null);
exports.PublicSettingsController = PublicSettingsController = __decorate([
    (0, common_1.Controller)('api/public/settings'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [settings_service_1.SettingsService,
        prisma_service_1.PrismaService])
], PublicSettingsController);
//# sourceMappingURL=public-settings.controller.js.map