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
exports.SeoController = void 0;
const common_1 = require("@nestjs/common");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const seo_service_1 = require("./seo.service");
let SeoController = class SeoController {
    seo;
    constructor(seo) {
        this.seo = seo;
    }
    async sitemap(tenantId, res) {
        const xml = await this.seo.buildSitemap(tenantId);
        res.send(xml);
    }
    async rss(tenantId, res) {
        const xml = await this.seo.buildRss(tenantId);
        res.send(xml);
    }
};
exports.SeoController = SeoController;
__decorate([
    (0, common_1.Get)('sitemap.xml'),
    (0, common_1.Header)('Content-Type', 'application/xml; charset=utf-8'),
    (0, common_1.Header)('Cache-Control', 'public, max-age=1800, s-maxage=1800'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "sitemap", null);
__decorate([
    (0, common_1.Get)('rss.xml'),
    (0, common_1.Header)('Content-Type', 'application/rss+xml; charset=utf-8'),
    (0, common_1.Header)('Cache-Control', 'public, max-age=600, s-maxage=600'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeoController.prototype, "rss", null);
exports.SeoController = SeoController = __decorate([
    (0, common_1.Controller)('api/seo'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [seo_service_1.SeoService])
], SeoController);
//# sourceMappingURL=seo.controller.js.map