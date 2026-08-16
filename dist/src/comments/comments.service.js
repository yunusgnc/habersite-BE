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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByArticle(tenantId, articleId) {
        return this.prisma.comment.findMany({
            where: {
                tenantId,
                articleId,
                status: client_1.CommentStatus.APPROVED,
                parentId: null,
            },
            include: {
                replies: {
                    where: { status: client_1.CommentStatus.APPROVED },
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findAll(tenantId, query) {
        const { articleId, status, cursor, limit = 20 } = query;
        const where = { tenantId };
        if (articleId)
            where.articleId = articleId;
        if (status)
            where.status = status;
        const [items, total] = await Promise.all([
            this.prisma.comment.findMany({
                where,
                take: limit + 1,
                ...(cursor && {
                    skip: 1,
                    cursor: { id: cursor },
                }),
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            }),
            this.prisma.comment.count({ where }),
        ]);
        const hasMore = items.length > limit;
        if (hasMore)
            items.pop();
        const nextCursor = hasMore ? items[items.length - 1]?.id : undefined;
        return { items, nextCursor, total };
    }
    async create(tenantId, dto, ipAddress) {
        const score = this.spamScore(dto.content, dto.name, dto.email);
        const status = score >= 3 ? client_1.CommentStatus.SPAM : client_1.CommentStatus.PENDING;
        const comment = await this.prisma.comment.create({
            data: {
                tenantId,
                articleId: dto.articleId,
                parentId: dto.parentId,
                name: dto.name,
                email: dto.email,
                content: dto.content,
                ipAddress,
                status,
            },
        });
        await this.prisma.article.update({
            where: { id: dto.articleId },
            data: { commentCount: { increment: 1 } },
        });
        return comment;
    }
    async updateStatus(tenantId, id, status) {
        const comment = await this.prisma.comment.findFirst({
            where: { id, tenantId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        return this.prisma.comment.update({
            where: { id },
            data: { status },
        });
    }
    async bulkUpdateStatus(tenantId, ids, status) {
        return this.prisma.comment.updateMany({
            where: { id: { in: ids }, tenantId },
            data: { status },
        });
    }
    async remove(tenantId, id) {
        const comment = await this.prisma.comment.findFirst({
            where: { id, tenantId },
        });
        if (!comment) {
            throw new common_1.NotFoundException('Comment not found');
        }
        await this.prisma.comment.delete({ where: { id } });
        await this.prisma.article.update({
            where: { id: comment.articleId },
            data: { commentCount: { decrement: 1 } },
        });
        return { deleted: true };
    }
    spamScore(content, name, email) {
        let score = 0;
        const text = (content ?? '').trim();
        const nText = text.toLowerCase();
        const links = text.match(/https?:\/\/[^\s]+/gi) ?? [];
        if (links.length >= 2)
            score += 2;
        else if (links.length === 1)
            score += 1;
        if (/(bit\.ly|goo\.gl|tinyurl\.com|t\.co|is\.gd)/i.test(text))
            score += 2;
        const letters = text.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, '');
        if (letters.length > 20) {
            const upper = letters.replace(/[^A-ZÇĞİÖŞÜ]/g, '').length;
            if (upper / letters.length > 0.6)
                score += 1;
        }
        const spamWords = [
            'viagra',
            'cialis',
            'casino',
            'bahis',
            'kredi',
            'takipçi satın al',
            'seo hizmeti',
            'porno',
            'crypto pump',
            'nft giveaway',
        ];
        for (const w of spamWords) {
            if (nText.includes(w))
                score += 1;
        }
        if (/(.)\1{5,}/.test(text))
            score += 1;
        if ((name ?? '').trim().length < 2)
            score += 1;
        if (!/^[^@]+@[^@]+\.[^@]{2,}$/.test((email ?? '').trim()))
            score += 1;
        if (text.length > 5000 || text.length < 3)
            score += 1;
        return score;
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map