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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const prisma_service_1 = require("../../prisma/prisma.service");
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
let AuditLogInterceptor = class AuditLogInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    intercept(ctx, next) {
        const request = ctx.switchToHttp().getRequest();
        const method = request.method?.toUpperCase();
        if (!WRITE_METHODS.has(method)) {
            return next.handle();
        }
        const tenantId = request.tenant?.id;
        const userId = request.user?.id;
        const entity = ctx.getClass().name;
        const action = method;
        return next.handle().pipe((0, rxjs_1.tap)(async () => {
            try {
                await this.prisma.auditLog.create({
                    data: {
                        tenantId,
                        userId,
                        action,
                        entity,
                        entityId: request.params?.id ?? null,
                        changes: request.body ? JSON.parse(JSON.stringify(request.body)) : null,
                        ipAddress: request.ip ?? null,
                    },
                });
            }
            catch {
            }
        }));
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map