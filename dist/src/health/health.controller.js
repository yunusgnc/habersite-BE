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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthController = class HealthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    check() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
    async ready() {
        const checks = {};
        const dbStart = Date.now();
        try {
            await this.prisma.$queryRaw `SELECT 1`;
            checks.database = { ok: true, latency: Date.now() - dbStart };
        }
        catch (err) {
            checks.database = { ok: false, error: err.message };
        }
        const allOk = Object.values(checks).every((c) => c.ok);
        return {
            status: allOk ? 'ready' : 'degraded',
            timestamp: new Date().toISOString(),
            checks,
        };
    }
};
exports.HealthController = HealthController;
__decorate([
    openapi.ApiOperation({ summary: "Basit liveness \u2014 process ayakta m\u0131. Load balancer i\u00E7in." }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    openapi.ApiOperation({ summary: "Readiness \u2014 DB'ye ula\u015Fabiliyor mu. Deploy pipeline'\u0131 i\u00E7in." }),
    (0, common_1.Get)('ready'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "ready", null);
exports.HealthController = HealthController = __decorate([
    (0, common_1.Controller)('api/health'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map