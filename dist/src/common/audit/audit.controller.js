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
exports.AuditController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const tenant_decorator_1 = require("../decorators/tenant.decorator");
const tenant_guard_1 = require("../guards/tenant.guard");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
let AuditController = class AuditController {
    audit;
    constructor(audit) {
        this.audit = audit;
    }
    list(tenantId, entity, entityId, userId, action, search, from, to, cursor, limit) {
        return this.audit.list({
            tenantId,
            entity,
            entityId,
            userId,
            action,
            search,
            from,
            to,
            cursor,
            limit: limit ? Number(limit) : 50,
        });
    }
    summary(tenantId, entity, userId, action, from, to, search) {
        return this.audit.summary({
            tenantId,
            entity,
            userId,
            action,
            from,
            to,
            search,
        });
    }
    async exportCsv(tenantId, entity, userId, action, search, from, to, res) {
        const rows = await this.audit.exportRows({
            tenantId,
            entity,
            userId,
            action,
            search,
            from,
            to,
        });
        const headers = [
            'Tarih',
            'Kullanıcı',
            'E-posta',
            'İşlem',
            'İçerik Tipi',
            'ID',
            'IP',
            'Değişiklik Özeti',
        ];
        const body = '﻿' +
            headers.map(csvEscape).join(',') +
            '\n' +
            rows
                .map((r) => {
                const summary = describeChanges(r.changes);
                return [
                    formatDate(r.createdAt),
                    r.user?.name ?? 'Sistem',
                    r.user?.email ?? '',
                    r.action,
                    r.entity,
                    r.entityId ?? '',
                    r.ipAddress ?? '',
                    summary,
                ]
                    .map(csvEscape)
                    .join(',');
            })
                .join('\n');
        const stamp = new Date().toISOString().slice(0, 10);
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="audit-log-${stamp}.csv"`);
        res.send(body);
    }
};
exports.AuditController = AuditController;
__decorate([
    openapi.ApiQuery({ name: "entity", required: false }),
    openapi.ApiQuery({ name: "entityId", required: false }),
    openapi.ApiQuery({ name: "userId", required: false }),
    openapi.ApiQuery({ name: "action", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    openapi.ApiQuery({ name: "cursor", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('entityId')),
    __param(3, (0, common_1.Query)('userId')),
    __param(4, (0, common_1.Query)('action')),
    __param(5, (0, common_1.Query)('search')),
    __param(6, (0, common_1.Query)('from')),
    __param(7, (0, common_1.Query)('to')),
    __param(8, (0, common_1.Query)('cursor')),
    __param(9, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "list", null);
__decorate([
    openapi.ApiQuery({ name: "entity", required: false }),
    openapi.ApiQuery({ name: "userId", required: false }),
    openapi.ApiQuery({ name: "action", required: false }),
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('from')),
    __param(5, (0, common_1.Query)('to')),
    __param(6, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AuditController.prototype, "summary", null);
__decorate([
    openapi.ApiQuery({ name: "entity", required: false }),
    openapi.ApiQuery({ name: "userId", required: false }),
    openapi.ApiQuery({ name: "action", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    openapi.ApiQuery({ name: "from", required: false }),
    openapi.ApiQuery({ name: "to", required: false }),
    (0, common_1.Get)('export.csv'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('entity')),
    __param(2, (0, common_1.Query)('userId')),
    __param(3, (0, common_1.Query)('action')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('from')),
    __param(6, (0, common_1.Query)('to')),
    __param(7, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuditController.prototype, "exportCsv", null);
exports.AuditController = AuditController = __decorate([
    (0, common_1.Controller)('api/audit-logs'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard, jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [audit_service_1.AuditService])
], AuditController);
function formatDate(d) {
    if (!d)
        return '';
    const date = new Date(d);
    if (isNaN(date.getTime()))
        return '';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
function csvEscape(value) {
    if (value === null || value === undefined)
        return '';
    const s = String(value);
    if (/[",\n]/.test(s))
        return `"${s.replace(/"/g, '""')}"`;
    return s;
}
function describeChanges(raw) {
    if (!raw || typeof raw !== 'object')
        return '';
    const changes = raw;
    const bits = [];
    if (typeof changes.title === 'string')
        bits.push(`title=${changes.title.slice(0, 80)}`);
    if (typeof changes.status === 'string')
        bits.push(`status=${changes.status}`);
    if (typeof changes.slug === 'string')
        bits.push(`slug=${changes.slug}`);
    if (typeof changes.email === 'string')
        bits.push(`email=${changes.email}`);
    return bits.join(' · ');
}
//# sourceMappingURL=audit.controller.js.map