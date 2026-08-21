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
var RevalidationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevalidationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let RevalidationService = RevalidationService_1 = class RevalidationService {
    prisma;
    logger = new common_1.Logger(RevalidationService_1.name);
    secret = process.env.REVALIDATE_SECRET;
    defaultUrl = process.env.DEFAULT_FRONTEND_URL;
    constructor(prisma) {
        this.prisma = prisma;
    }
    revalidateTenant(tenantId, tags) {
        if (tags.length === 0)
            return;
        void this.dispatch(tenantId, tags);
    }
    async dispatch(tenantId, tags) {
        try {
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { domain: true, active: true },
            });
            if (!tenant || !tenant.active)
                return;
            const base = this.resolveBaseUrl(tenant.domain);
            if (!base)
                return;
            const url = new URL('/api/revalidate', base);
            tags.forEach((t) => url.searchParams.append('tag', t));
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 3000);
            try {
                const res = await fetch(url.toString(), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(this.secret ? { 'x-revalidate-secret': this.secret } : {}),
                    },
                    signal: controller.signal,
                });
                if (!res.ok) {
                    this.logger.warn(`Revalidate ${url.host} → HTTP ${res.status} tags=[${tags.join(',')}]`);
                }
            }
            finally {
                clearTimeout(timer);
            }
        }
        catch (err) {
            this.logger.warn(`Revalidate failed tenant=${tenantId} tags=[${tags.join(',')}]: ${err.message}`);
        }
    }
    resolveBaseUrl(domain) {
        if (domain && domain.trim()) {
            const clean = domain.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
            return `https://${clean}`;
        }
        return this.defaultUrl?.trim() || null;
    }
};
exports.RevalidationService = RevalidationService;
exports.RevalidationService = RevalidationService = RevalidationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RevalidationService);
//# sourceMappingURL=revalidation.service.js.map