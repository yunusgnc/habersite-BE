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
var RssImportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RssImportService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const slugify_1 = __importDefault(require("slugify"));
const prisma_service_1 = require("../prisma/prisma.service");
const rss_parser_1 = require("./rss-parser");
let RssImportService = RssImportService_1 = class RssImportService {
    prisma;
    logger = new common_1.Logger(RssImportService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(tenantId) {
        return this.prisma.rssSource.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async get(tenantId, id) {
        const source = await this.prisma.rssSource.findFirst({
            where: { id, tenantId },
        });
        if (!source)
            throw new common_1.NotFoundException('Kaynak bulunamadı');
        return source;
    }
    async create(tenantId, dto) {
        return this.prisma.rssSource.create({
            data: {
                tenantId,
                name: dto.name,
                url: dto.url,
                defaultCategoryId: dto.defaultCategoryId,
                defaultAuthorName: dto.defaultAuthorName,
                active: dto.active ?? true,
                fetchIntervalMinutes: dto.fetchIntervalMinutes ?? 30,
            },
        });
    }
    async update(tenantId, id, dto) {
        await this.get(tenantId, id);
        return this.prisma.rssSource.update({
            where: { id },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.url !== undefined && { url: dto.url }),
                ...(dto.defaultCategoryId !== undefined && {
                    defaultCategoryId: dto.defaultCategoryId,
                }),
                ...(dto.defaultAuthorName !== undefined && {
                    defaultAuthorName: dto.defaultAuthorName,
                }),
                ...(dto.active !== undefined && { active: dto.active }),
                ...(dto.fetchIntervalMinutes !== undefined && {
                    fetchIntervalMinutes: dto.fetchIntervalMinutes,
                }),
            },
        });
    }
    async remove(tenantId, id) {
        await this.get(tenantId, id);
        await this.prisma.rssSource.delete({ where: { id } });
        return { deleted: true };
    }
    async pollDueSources() {
        const now = new Date();
        const sources = await this.prisma.rssSource.findMany({
            where: { active: true },
            select: {
                id: true,
                tenantId: true,
                fetchIntervalMinutes: true,
                lastFetchedAt: true,
            },
        });
        const due = sources.filter((s) => {
            if (!s.lastFetchedAt)
                return true;
            const nextDue = new Date(s.lastFetchedAt.getTime() + s.fetchIntervalMinutes * 60_000);
            return nextDue <= now;
        });
        if (due.length === 0)
            return;
        this.logger.log(`[RSS] ${due.length} kaynak çekilecek`);
        for (const s of due) {
            try {
                await this.fetchOne(s.tenantId, s.id);
            }
            catch (e) {
                this.logger.warn(`[RSS] Kaynak ${s.id} çekilemedi: ${e.message}`);
            }
        }
    }
    async fetchOne(tenantId, id) {
        const source = await this.get(tenantId, id);
        let xml;
        let items;
        try {
            const res = await fetch(source.url, {
                headers: {
                    'User-Agent': 'HaberSite-RSS/1.0 (+https://habersite.com)',
                    Accept: 'application/rss+xml, application/atom+xml, application/xml',
                },
                signal: AbortSignal.timeout(15000),
            });
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            xml = await res.text();
            items = (0, rss_parser_1.parseFeed)(xml);
        }
        catch (e) {
            await this.prisma.rssSource.update({
                where: { id: source.id },
                data: {
                    lastFetchedAt: new Date(),
                    lastFetchStatus: `HATA: ${e.message}`.slice(0, 200),
                },
            });
            throw e;
        }
        if (items.length === 0) {
            await this.prisma.rssSource.update({
                where: { id: source.id },
                data: {
                    lastFetchedAt: new Date(),
                    lastFetchStatus: 'Feed boş veya parse edilemedi',
                },
            });
            return { imported: 0, skipped: 0 };
        }
        const admin = await this.prisma.user.findFirst({
            where: {
                tenantId,
                role: { in: ['ADMIN', 'SUPER_ADMIN', 'EDITOR'] },
            },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        });
        if (!admin) {
            throw new common_1.BadRequestException('Tenant için editör veya admin kullanıcı yok; import edilemiyor');
        }
        let categoryId = source.defaultCategoryId;
        if (!categoryId) {
            const firstCat = await this.prisma.category.findFirst({
                where: { tenantId, active: true },
                orderBy: { sortOrder: 'asc' },
                select: { id: true },
            });
            categoryId = firstCat?.id ?? null;
        }
        let authorId = null;
        if (source.defaultAuthorName) {
            const slug = (0, slugify_1.default)(source.defaultAuthorName, {
                lower: true,
                strict: true,
                locale: 'tr',
            });
            const existing = await this.prisma.author.findUnique({
                where: { tenantId_slug: { tenantId, slug } },
                select: { id: true },
            });
            if (existing) {
                authorId = existing.id;
            }
            else {
                const created = await this.prisma.author.create({
                    data: { tenantId, name: source.defaultAuthorName, slug },
                });
                authorId = created.id;
            }
        }
        let imported = 0;
        let skipped = 0;
        for (const item of items) {
            const already = await this.prisma.rssImportedItem.findUnique({
                where: { sourceId_guid: { sourceId: source.id, guid: item.guid } },
                select: { id: true },
            });
            if (already) {
                skipped++;
                continue;
            }
            const baseSlug = (0, slugify_1.default)(item.title, {
                lower: true,
                strict: true,
                locale: 'tr',
            }).slice(0, 80) || 'haber';
            let slug = baseSlug;
            let n = 1;
            while (await this.prisma.article.findUnique({
                where: { tenantId_slug: { tenantId, slug } },
                select: { id: true },
            })) {
                slug = `${baseSlug}-${n++}`;
                if (n > 20) {
                    slug = `${baseSlug}-${Date.now().toString(36)}`;
                    break;
                }
            }
            const bodyText = item.description
                .replace(/<script[\s\S]*?<\/script>/gi, '')
                .replace(/<style[\s\S]*?<\/style>/gi, '')
                .trim();
            try {
                const article = await this.prisma.article.create({
                    data: {
                        tenantId,
                        title: item.title.slice(0, 300),
                        slug,
                        spot: bodyText ? bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300) : null,
                        content: {
                            type: 'doc',
                            content: bodyText
                                ? [
                                    {
                                        type: 'paragraph',
                                        content: [{ type: 'text', text: bodyText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }],
                                    },
                                ]
                                : [{ type: 'paragraph' }],
                        },
                        featuredImage: item.imageUrl,
                        status: 'DRAFT',
                        authorId,
                        createdById: admin.id,
                        source: source.name,
                        sourceUrl: item.link,
                        publishedAt: item.publishedAt,
                        categories: categoryId
                            ? { create: [{ categoryId }] }
                            : undefined,
                    },
                });
                await this.prisma.rssImportedItem.create({
                    data: {
                        sourceId: source.id,
                        tenantId,
                        guid: item.guid,
                        articleId: article.id,
                    },
                });
                imported++;
            }
            catch (e) {
                this.logger.warn(`[RSS ${source.id}] item hata: ${e.message}`);
            }
        }
        await this.prisma.rssSource.update({
            where: { id: source.id },
            data: {
                lastFetchedAt: new Date(),
                lastFetchStatus: `OK: ${imported} yeni, ${skipped} atlandı`,
                itemsImported: { increment: imported },
            },
        });
        return { imported, skipped };
    }
};
exports.RssImportService = RssImportService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RssImportService.prototype, "pollDueSources", null);
exports.RssImportService = RssImportService = RssImportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RssImportService);
//# sourceMappingURL=rss-import.service.js.map