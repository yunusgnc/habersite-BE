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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonProfilesService = void 0;
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
let PersonProfilesService = class PersonProfilesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(tenantId, options = {}) {
        const take = (options.limit || 20) + 1;
        const where = { tenantId };
        if (options.search) {
            where.name = { contains: options.search, mode: 'insensitive' };
        }
        const items = await this.prisma.personProfile.findMany({
            where,
            take,
            ...(options.cursor && {
                skip: 1,
                cursor: { id: options.cursor },
            }),
            orderBy: { createdAt: 'desc' },
        });
        const hasMore = items.length === take;
        if (hasMore)
            items.pop();
        return {
            items,
            nextCursor: hasMore ? items[items.length - 1]?.id : null,
            hasMore,
        };
    }
    async findOne(tenantId, id) {
        const profile = await this.prisma.personProfile.findFirst({
            where: { id, tenantId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Person profile not found');
        }
        return profile;
    }
    async findBySlug(tenantId, slug) {
        const profile = await this.prisma.personProfile.findUnique({
            where: { tenantId_slug: { tenantId, slug } },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Person profile not found');
        }
        return profile;
    }
    async create(tenantId, dto) {
        const slug = await this.generateUniqueSlug(tenantId, dto.name);
        return this.prisma.personProfile.create({
            data: {
                tenantId,
                slug,
                name: dto.name,
                bio: dto.bio,
                image: dto.image,
                birthDate: dto.birthDate,
                title: dto.title,
                social: dto.social ?? {},
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.ensureExists(tenantId, id);
        const data = { ...dto };
        if (dto.name) {
            data.slug = await this.generateUniqueSlug(tenantId, dto.name, id);
        }
        return this.prisma.personProfile.update({
            where: { id },
            data,
        });
    }
    async remove(tenantId, id) {
        await this.ensureExists(tenantId, id);
        return this.prisma.personProfile.delete({ where: { id } });
    }
    async ensureExists(tenantId, id) {
        const profile = await this.prisma.personProfile.findFirst({
            where: { id, tenantId },
        });
        if (!profile) {
            throw new common_1.NotFoundException('Person profile not found');
        }
        return profile;
    }
    async generateUniqueSlug(tenantId, name, excludeId) {
        let slug = (0, slugify_1.default)(name, { lower: true, strict: true, locale: 'tr' });
        let suffix = 0;
        let candidate = slug;
        while (true) {
            const existing = await this.prisma.personProfile.findUnique({
                where: { tenantId_slug: { tenantId, slug: candidate } },
            });
            if (!existing || existing.id === excludeId) {
                return candidate;
            }
            suffix++;
            candidate = `${slug}-${suffix}`;
        }
    }
};
exports.PersonProfilesService = PersonProfilesService;
exports.PersonProfilesService = PersonProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PersonProfilesService);
//# sourceMappingURL=person-profiles.service.js.map