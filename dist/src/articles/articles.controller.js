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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticlesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const articles_service_1 = require("./articles.service");
const create_article_dto_1 = require("./dto/create-article.dto");
const update_article_dto_1 = require("./dto/update-article.dto");
const query_articles_dto_1 = require("./dto/query-articles.dto");
const bulk_article_dto_1 = require("./dto/bulk-article.dto");
const react_dto_1 = require("./dto/react.dto");
const tenant_guard_1 = require("../common/guards/tenant.guard");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const optional_jwt_auth_guard_1 = require("../auth/guards/optional-jwt-auth.guard");
const client_1 = require("@prisma/client");
const roles_guard_1 = require("../auth/guards/roles.guard");
const tenant_decorator_1 = require("../common/decorators/tenant.decorator");
const user_decorator_1 = require("../common/decorators/user.decorator");
let ArticlesController = class ArticlesController {
    articlesService;
    constructor(articlesService) {
        this.articlesService = articlesService;
    }
    findAll(tenantId, query, user) {
        if (!user) {
            return this.articlesService.findAll(tenantId, {
                ...query,
                status: client_1.ArticleStatus.PUBLISHED,
            });
        }
        return this.articlesService.findAll(tenantId, query);
    }
    findById(tenantId, id) {
        return this.articlesService.findById(tenantId, id);
    }
    sitemap(tenantId, page, perPage) {
        const p = Math.max(1, parseInt(page ?? '1', 10) || 1);
        const pp = Math.min(5000, Math.max(1, parseInt(perPage ?? '5000', 10) || 5000));
        return this.articlesService.sitemap(tenantId, p, pp);
    }
    recentForNews(tenantId, limit) {
        const n = Math.min(1000, Math.max(1, parseInt(limit ?? '1000', 10) || 1000));
        return this.articlesService.recentForNews(tenantId, n);
    }
    getMostRead(tenantId, limit) {
        return this.articlesService.getMostRead(tenantId, limit ? +limit : 10);
    }
    getTrending(tenantId, limit) {
        return this.articlesService.getMostRead(tenantId, limit ? +limit : 10);
    }
    archiveFacets(tenantId) {
        return this.articlesService.archiveFacets(tenantId);
    }
    getReactions(tenantId, id) {
        return this.articlesService.getReactions(tenantId, id);
    }
    react(tenantId, id, dto) {
        return this.articlesService.react(tenantId, id, dto.type, dto.previous);
    }
    unreact(tenantId, id, dto) {
        return this.articlesService.unreact(tenantId, id, dto.type);
    }
    getRelated(tenantId, id, limit) {
        return this.articlesService.getRelated(tenantId, id, limit ? +limit : 5);
    }
    async findBySlug(tenantId, slug) {
        const article = await this.articlesService.findBySlug(tenantId, slug);
        this.articlesService.incrementViewCount(tenantId, article.id);
        return article;
    }
    create(tenantId, user, dto) {
        return this.articlesService.create(tenantId, user.userId, dto, user?.role);
    }
    update(tenantId, id, dto, user) {
        return this.articlesService.update(tenantId, id, dto, user?.userId, user?.role);
    }
    listRevisions(tenantId, id) {
        return this.articlesService.listRevisions(tenantId, id);
    }
    restoreRevision(tenantId, id, revisionId, user) {
        return this.articlesService.restoreRevision(tenantId, id, revisionId, user?.userId);
    }
    bulkDelete(tenantId, dto) {
        return this.articlesService.bulkDelete(tenantId, dto.ids);
    }
    remove(tenantId, id, user) {
        return this.articlesService.remove(tenantId, id, user?.userId);
    }
    bulkUpdateStatus(tenantId, dto) {
        return this.articlesService.bulkUpdateStatus(tenantId, dto.ids, dto.status);
    }
    bulkUpdateCategory(tenantId, dto) {
        return this.articlesService.bulkUpdateCategory(tenantId, dto.ids, dto.categoryId);
    }
    myTasks(tenantId, user) {
        return this.articlesService.myTasks(tenantId, user.userId);
    }
    reviewQueue(tenantId) {
        return this.articlesService.reviewQueue(tenantId);
    }
    submitForReview(tenantId, id, user) {
        return this.articlesService.submitForReview(tenantId, id, user.userId);
    }
    approve(tenantId, id, user) {
        return this.articlesService.approve(tenantId, id, user.userId, user.role);
    }
    reject(tenantId, id, body, user) {
        return this.articlesService.reject(tenantId, id, user.userId, user.role, body.note);
    }
    assign(tenantId, id, body, user) {
        return this.articlesService.assign(tenantId, id, user.userId, user.role, body);
    }
};
exports.ArticlesController = ArticlesController;
__decorate([
    openapi.ApiOperation({ summary: "Bu u\u00E7 noktay\u0131 hem panel hem de herkese a\u00E7\u0131k site kullan\u0131yor. Panel b\u00FCt\u00FCn\ndurumlar\u0131 g\u00F6rmek zorunda (taslak listesi, \"T\u00FCm\u00FC\" sekmesi), ziyaret\u00E7i ise\nyaln\u0131zca yay\u0131nlanm\u0131\u015Flar\u0131 g\u00F6rmeli. Ayr\u0131m kimlik do\u011Frulamayla yap\u0131l\u0131yor:\ntoken yoksa `status` iste\u011Fe bak\u0131lmaks\u0131z\u0131n PUBLISHED'a sabitlenir.\n\nDaha \u00F6nce filtre yoktu; taslak haberler ana sayfada man\u015Fete kadar\n\u00E7\u0131k\u0131yordu." }),
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(optional_jwt_auth_guard_1.OptionalJwtAuthGuard),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_articles_dto_1.QueryArticlesDto, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id/detail'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "findById", null);
__decorate([
    openapi.ApiOperation({ summary: "Sitemap \u00FCretimi i\u00E7in hafif bir u\u00E7 nokta. Genel liste 50 sat\u0131rla s\u0131n\u0131rl\u0131;\narama motoruna 42 binin \u00FCzerinde haber sunmak i\u00E7in 100 istek atmak\nmakul de\u011Fil. Buras\u0131 yaln\u0131zca slug + tarih d\u00F6ner (kapak, spot, i\u00E7erik\nyok) ve sayfa ba\u015F\u0131na 5.000 kay\u0131t verir.\n\nHerkese a\u00E7\u0131k: taslaklar\u0131 g\u00F6stermez, kimlik do\u011Frulama gerektirmez." }),
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "perPage", required: false }),
    (0, common_1.Get)('sitemap'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('perPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "sitemap", null);
__decorate([
    openapi.ApiOperation({ summary: "Google News sitemap'i ve RSS i\u00E7in son 48 saatteki haberler. Herkese a\u00E7\u0131k.\nGoogle News 2 g\u00FCnden eski haberi kabul etmedi\u011Fi i\u00E7in aral\u0131k sabit." }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('recent-for-news'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "recentForNews", null);
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('most-read'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "getMostRead", null);
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('trending'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "getTrending", null);
__decorate([
    (0, common_1.Get)('archive-facets'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "archiveFacets", null);
__decorate([
    openapi.ApiOperation({ summary: "TEPK\u0130LER \u2014 herkese a\u00E7\u0131k, giri\u015F \u0130STEMEZ. Okuyucu emojiyle tepki verir,\nsaya\u00E7lar herkese g\u00F6r\u00FCn\u00FCr. Ki\u015Fi kayd\u0131 tutulmad\u0131\u011F\u0131 i\u00E7in tek koruma IP\nba\u015F\u0131na h\u0131z s\u0131n\u0131r\u0131: 20 tepki/dakika bir insan i\u00E7in bol, bir script i\u00E7in\ncayd\u0131r\u0131c\u0131." }),
    (0, common_1.Get)(':id/reactions'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "getReactions", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, common_1.Post)(':id/reactions'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, react_dto_1.ReactDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "react", null);
__decorate([
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: 60_000 } }),
    (0, common_1.Delete)(':id/reactions'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, react_dto_1.UnreactDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "unreact", null);
__decorate([
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)(':id/related'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "getRelated", null);
__decorate([
    (0, common_1.Get)(':slug'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ArticlesController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('COLUMNIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, create_article_dto_1.CreateArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('COLUMNIST'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_article_dto_1.UpdateArticleDto, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/revisions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "listRevisions", null);
__decorate([
    (0, common_1.Post)(':id/revisions/:revisionId/restore'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('revisionId')),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "restoreRevision", null);
__decorate([
    openapi.ApiOperation({ summary: "SIRA \u00D6NEML\u0130: `:id` rotas\u0131ndan \u00D6NCE olmak zorunda.\n\nA\u015Fa\u011F\u0131dayd\u0131 ve Express rotalar\u0131 bildirim s\u0131ras\u0131na g\u00F6re e\u015Fle\u015Ftirdi\u011Fi i\u00E7in\n`DELETE /articles/bulk` iste\u011Fi buraya hi\u00E7 ula\u015Fm\u0131yordu \u2014 \"bulk\" bir haber\nkimli\u011Fi san\u0131l\u0131yor, istek 404 d\u00F6n\u00FCyordu. Panelde toplu silme fiilen\n\u00E7al\u0131\u015Fm\u0131yordu ve hata bir uyar\u0131 balonuna d\u00F6n\u00FC\u015Ft\u00FC\u011F\u00FC i\u00E7in sebebi g\u00F6r\u00FCnm\u00FCyordu." }),
    (0, common_1.Delete)('bulk'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)('bulk/status'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bulk_article_dto_1.BulkArticleDto]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "bulkUpdateStatus", null);
__decorate([
    (0, common_1.Patch)('bulk/category'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('ADMIN', 'EDITOR'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "bulkUpdateCategory", null);
__decorate([
    (0, common_1.Get)('workflow/my-tasks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('COLUMNIST'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "myTasks", null);
__decorate([
    (0, common_1.Get)('workflow/review-queue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200, type: [Object] }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "reviewQueue", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('COLUMNIST'),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "submitForReview", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "reject", null);
__decorate([
    (0, common_1.Patch)(':id/assign'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_guard_1.Roles)('EDITOR'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, tenant_decorator_1.CurrentTenant)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], ArticlesController.prototype, "assign", null);
exports.ArticlesController = ArticlesController = __decorate([
    (0, common_1.Controller)('api/articles'),
    (0, common_1.UseGuards)(tenant_guard_1.TenantGuard),
    __metadata("design:paramtypes", [articles_service_1.ArticlesService])
], ArticlesController);
//# sourceMappingURL=articles.controller.js.map