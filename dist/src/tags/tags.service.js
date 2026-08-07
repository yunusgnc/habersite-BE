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
exports.TagsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TagsService = class TagsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId) {
        return this.prisma.tag.findMany({
            where: { tenantId },
            orderBy: { name: 'asc' },
            include: { _count: { select: { articles: true } } },
        });
    }
    async findOne(tenantId, id) {
        const tag = await this.prisma.tag.findFirst({
            where: { id, tenantId },
            include: { _count: { select: { articles: true } } },
        });
        if (!tag)
            throw new common_1.NotFoundException('Tag not found');
        return tag;
    }
    async create(tenantId, dto) {
        const existing = await this.prisma.tag.findUnique({
            where: { tenantId_slug: { tenantId, slug: dto.slug } },
        });
        if (existing)
            throw new common_1.ConflictException('Bu slug zaten kullanılıyor');
        return this.prisma.tag.create({
            data: { ...dto, tenantId },
        });
    }
    async update(tenantId, id, dto) {
        await this.findOne(tenantId, id);
        if (dto.slug) {
            const existing = await this.prisma.tag.findFirst({
                where: { tenantId, slug: dto.slug, NOT: { id } },
            });
            if (existing)
                throw new common_1.ConflictException('Bu slug zaten kullanılıyor');
        }
        return this.prisma.tag.update({ where: { id }, data: dto });
    }
    async remove(tenantId, id) {
        await this.findOne(tenantId, id);
        return this.prisma.tag.delete({ where: { id } });
    }
};
exports.TagsService = TagsService;
exports.TagsService = TagsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TagsService);
//# sourceMappingURL=tags.service.js.map