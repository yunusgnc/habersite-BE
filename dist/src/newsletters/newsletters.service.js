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
exports.NewslettersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NewslettersService = class NewslettersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.newsletterSubscriber.findMany({
            where: { tenantId, unsubscribed: false },
            orderBy: { createdAt: 'desc' },
        });
    }
    async subscribe(tenantId, email, name) {
        const existing = await this.prisma.newsletterSubscriber.findUnique({
            where: { tenantId_email: { tenantId, email } },
        });
        if (existing) {
            if (existing.unsubscribed) {
                return this.prisma.newsletterSubscriber.update({
                    where: { id: existing.id },
                    data: { unsubscribed: false, name },
                });
            }
            throw new common_1.ConflictException('Already subscribed');
        }
        return this.prisma.newsletterSubscriber.create({
            data: { tenantId, email, name },
        });
    }
    async unsubscribe(tenantId, email) {
        return this.prisma.newsletterSubscriber.updateMany({
            where: { tenantId, email },
            data: { unsubscribed: true },
        });
    }
    async getCount(tenantId) {
        return this.prisma.newsletterSubscriber.count({
            where: { tenantId, unsubscribed: false },
        });
    }
};
exports.NewslettersService = NewslettersService;
exports.NewslettersService = NewslettersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewslettersService);
//# sourceMappingURL=newsletters.service.js.map