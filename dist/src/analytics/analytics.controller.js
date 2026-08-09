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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const analytics_service_1 = require("./analytics.service");
const reports_service_1 = require("./reports.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const VALID_RANGES = ['7d', '30d', '90d', '1y', 'all'];
function parseRange(input) {
    if (typeof input === 'string' && VALID_RANGES.includes(input)) {
        return input;
    }
    return '30d';
}
let AnalyticsController = class AnalyticsController {
    service;
    reports;
    constructor(service, reports) {
        this.service = service;
        this.reports = reports;
    }
    reportsMeta() {
        return this.reports.meta();
    }
    runReport(tenantId, type, search, from, to, status) {
        return this.reports.run(tenantId, type, {
            search,
            from,
            to,
            status,
        });
    }
    async exportReport(tenantId, type, search, from, to, status, columns, res) {
        try {
            const cols = (columns ?? '')
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean);
            const { filename, body } = await this.reports.csv(tenantId, type, { search, from, to, status }, cols);
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(body);
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
    overview(tenantId, range) {
        return this.service.overview(tenantId, parseRange(range));
    }
    topArticles(tenantId, range, limit) {
        return this.service.topArticles(tenantId, parseRange(range), limit ? Math.min(100, Math.max(1, Number(limit))) : 20);
    }
    byCategory(tenantId) {
        return this.service.byCategory(tenantId);
    }
    byAuthor(tenantId) {
        return this.service.byAuthor(tenantId);
    }
    byStatus(tenantId) {
        return this.service.byStatus(tenantId);
    }
    commentBreakdown(tenantId) {
        return this.service.commentBreakdown(tenantId);
    }
    publishTimeSeries(tenantId, range) {
        return this.service.publishTimeSeries(tenantId, parseRange(range));
    }
    async exportCsv(tenantId, report, range, res) {
        try {
            const { filename, body } = await this.service.csv(tenantId, report, parseRange(range));
            res.setHeader('Content-Type', 'text/csv; charset=utf-8');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.send(body);
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('reports/meta'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "reportsMeta", null);
__decorate([
    (0, common_1.Get)('reports/:type'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "runReport", null);
__decorate([
    (0, common_1.Get)('reports/:type/export.csv'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('type')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('from')),
    __param(4, (0, common_1.Query)('to')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Query)('columns')),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportReport", null);
__decorate([
    (0, common_1.Get)('overview'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "overview", null);
__decorate([
    (0, common_1.Get)('top-articles'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('range')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "topArticles", null);
__decorate([
    (0, common_1.Get)('by-category'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "byCategory", null);
__decorate([
    (0, common_1.Get)('by-author'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "byAuthor", null);
__decorate([
    (0, common_1.Get)('by-status'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "byStatus", null);
__decorate([
    (0, common_1.Get)('comment-breakdown'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "commentBreakdown", null);
__decorate([
    (0, common_1.Get)('publish-timeseries'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('range')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AnalyticsController.prototype, "publishTimeSeries", null);
__decorate([
    (0, common_1.Get)('export/:report'),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('report')),
    __param(2, (0, common_1.Query)('range')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "exportCsv", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('api/analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService,
        reports_service_1.ReportsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map