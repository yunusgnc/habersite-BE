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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    selectFields = {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        active: true,
        lastLoginAt: true,
        createdAt: true,
    };
    async findAll(tenantId, opts = {}) {
        const limit = Math.min(100, opts.limit ?? 30);
        const where = { tenantId };
        if (opts.search?.trim()) {
            const q = opts.search.trim();
            where.OR = [
                { name: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { username: { contains: q, mode: 'insensitive' } },
            ];
        }
        if (opts.role)
            where.role = opts.role;
        const [items, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                select: this.selectFields,
                orderBy: { createdAt: 'desc' },
                take: limit + 1,
                ...(opts.cursor
                    ? { cursor: { id: opts.cursor }, skip: 1 }
                    : {}),
            }),
            this.prisma.user.count({ where }),
        ]);
        let nextCursor;
        if (items.length > limit) {
            const next = items.pop();
            nextCursor = next.id;
        }
        return { items, nextCursor, total };
    }
    async findById(tenantId, id) {
        const user = await this.prisma.user.findFirst({
            where: { id, tenantId },
            select: this.selectFields,
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async create(tenantId, data) {
        const existing = await this.prisma.user.findFirst({
            where: { tenantId, email: data.email },
        });
        if (existing) {
            throw new common_1.ConflictException('Bu e-posta adresi zaten kullanılıyor');
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                tenantId,
                name: data.name,
                email: data.email,
                passwordHash,
                role: data.role ?? 'REPORTER',
                active: data.active ?? true,
            },
            select: this.selectFields,
        });
    }
    async update(tenantId, id, data) {
        await this.findById(tenantId, id);
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.email !== undefined)
            updateData.email = data.email;
        if (data.role !== undefined)
            updateData.role = data.role;
        if (data.active !== undefined)
            updateData.active = data.active;
        if (data.password) {
            updateData.passwordHash = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data: updateData,
            select: this.selectFields,
        });
    }
    async updateRole(tenantId, id, role) {
        await this.findById(tenantId, id);
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, name: true, email: true, role: true },
        });
    }
    async toggleActive(tenantId, id) {
        const user = await this.prisma.user.findFirst({ where: { id, tenantId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { active: !user.active },
            select: { id: true, name: true, active: true },
        });
    }
    async remove(tenantId, id) {
        await this.findById(tenantId, id);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map