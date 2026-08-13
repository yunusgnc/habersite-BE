"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadersService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
let ReadersService = class ReadersService {
    prisma;
    jwt;
    config;
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
    }
    async issueToken(readerId, tenantId) {
        return this.jwt.signAsync({ sub: readerId, tenantId, type: 'reader' }, {
            secret: this.config.get('JWT_SECRET', 'changeme'),
            expiresIn: '30d',
        });
    }
    async register(tenantId, dto) {
        const email = dto.email.toLowerCase().trim();
        const clash = await this.prisma.reader.findUnique({
            where: { tenantId_email: { tenantId, email } },
            select: { id: true },
        });
        if (clash) {
            throw new common_1.ConflictException('Bu e-posta ile kayıtlı bir hesap var');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const reader = await this.prisma.reader.create({
            data: {
                tenantId,
                email,
                passwordHash,
                name: dto.name,
            },
        });
        const token = await this.issueToken(reader.id, tenantId);
        return this.serialize(reader, token);
    }
    async login(tenantId, dto) {
        const email = dto.email.toLowerCase().trim();
        const reader = await this.prisma.reader.findUnique({
            where: { tenantId_email: { tenantId, email } },
        });
        if (!reader || !reader.active) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı');
        }
        const ok = await bcrypt.compare(dto.password, reader.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('E-posta veya şifre hatalı');
        }
        await this.prisma.reader.update({
            where: { id: reader.id },
            data: { lastLoginAt: new Date() },
        });
        const token = await this.issueToken(reader.id, tenantId);
        return this.serialize(reader, token);
    }
    async me(readerId) {
        const reader = await this.prisma.reader.findUnique({
            where: { id: readerId },
        });
        if (!reader)
            throw new common_1.NotFoundException('Hesap bulunamadı');
        return this.serialize(reader);
    }
    async updateMe(readerId, dto) {
        const reader = await this.prisma.reader.findUnique({
            where: { id: readerId },
        });
        if (!reader)
            throw new common_1.NotFoundException('Hesap bulunamadı');
        const data = {};
        if (dto.name !== undefined)
            data.name = dto.name;
        if (dto.password)
            data.passwordHash = await bcrypt.hash(dto.password, 10);
        const updated = await this.prisma.reader.update({
            where: { id: reader.id },
            data,
        });
        return this.serialize(updated);
    }
    async listBookmarks(readerId, tenantId) {
        return this.prisma.bookmark.findMany({
            where: {
                readerId,
                article: { tenantId },
            },
            orderBy: { createdAt: 'desc' },
            include: {
                article: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        featuredImage: true,
                        spot: true,
                        publishedAt: true,
                        categories: {
                            select: {
                                category: { select: { name: true, slug: true } },
                            },
                            take: 1,
                        },
                    },
                },
            },
        });
    }
    async addBookmark(readerId, tenantId, articleId) {
        const article = await this.prisma.article.findFirst({
            where: { id: articleId, tenantId, status: 'PUBLISHED' },
            select: { id: true },
        });
        if (!article)
            throw new common_1.NotFoundException('Haber bulunamadı');
        try {
            return await this.prisma.bookmark.create({
                data: { readerId, articleId },
            });
        }
        catch (e) {
            if (e?.code === 'P2002') {
                throw new common_1.ConflictException('Bu haber zaten kaydedilmiş');
            }
            throw e;
        }
    }
    async removeBookmark(readerId, articleId) {
        const b = await this.prisma.bookmark.findUnique({
            where: { readerId_articleId: { readerId, articleId } },
        });
        if (!b)
            throw new common_1.NotFoundException('Kaydedilmemiş');
        await this.prisma.bookmark.delete({ where: { id: b.id } });
        return { deleted: true };
    }
    async isBookmarked(readerId, articleId) {
        if (!articleId)
            throw new common_1.BadRequestException('articleId zorunlu');
        const b = await this.prisma.bookmark.findUnique({
            where: { readerId_articleId: { readerId, articleId } },
            select: { id: true },
        });
        return { bookmarked: !!b };
    }
    serialize(reader, token) {
        return {
            id: reader.id,
            email: reader.email,
            name: reader.name,
            active: reader.active,
            emailVerified: reader.emailVerified,
            createdAt: reader.createdAt,
            ...(token && { token }),
        };
    }
};
exports.ReadersService = ReadersService;
exports.ReadersService = ReadersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], ReadersService);
//# sourceMappingURL=readers.service.js.map