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
exports.RedirectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RedirectsService = class RedirectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.redirect.findMany({
            where: { tenantId },
            orderBy: { source: 'asc' },
        });
    }
    async resolve(tenantId, source) {
        return this.prisma.redirect.findUnique({
            where: { tenantId_source: { tenantId, source } },
        });
    }
    async create(tenantId, data) {
        return this.prisma.redirect.create({
            data: { tenantId, ...data },
        });
    }
    async createMany(tenantId, redirects) {
        return this.prisma.redirect.createMany({
            data: redirects.map((r) => ({ tenantId, ...r })),
            skipDuplicates: true,
        });
    }
    async remove(tenantId, id) {
        return this.prisma.redirect.delete({ where: { id } });
    }
};
exports.RedirectsService = RedirectsService;
exports.RedirectsService = RedirectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RedirectsService);
//# sourceMappingURL=redirects.service.js.map