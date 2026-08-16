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
exports.CreateArticleDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class CreateArticleDto {
    title;
    slug;
    content;
    type = client_1.ArticleType.NEWS;
    spot;
    featuredImage;
    status;
    categoryIds;
    tagNames;
    authorId;
    seoTitle;
    seoDesc;
    source;
    sourceUrl;
    featured;
    nationalFeatured;
    headlineTitle;
    headlineImage;
    headlineFontSize;
    headlineFontFamily;
    hideHeadlineOverlay;
    publishedAt;
    scheduledAt;
    breakingLabel;
    assignedToId;
    deadline;
    reviewNote;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 3 }, slug: { required: false, type: () => String, description: "Haberin adres par\u00E7as\u0131. Bo\u015F b\u0131rak\u0131l\u0131rsa ba\u015Fl\u0131ktan t\u00FCretilir.\n\nPanel bu alan\u0131 g\u00F6nderiyordu ama burada kar\u015F\u0131l\u0131\u011F\u0131 yoktu; do\u011Frulama katman\u0131\nonu sessizce d\u00FC\u015F\u00FCr\u00FCyor ve slug her zaman ba\u015Fl\u0131ktan \u00FCretiliyordu. Edit\u00F6r\u00FCn\nyazd\u0131\u011F\u0131 adres kayboluyordu \u2014 SEO a\u00E7\u0131s\u0131ndan \u00F6nemli bir alanda sessiz veri\nkayb\u0131." }, content: { required: true, type: "object", additionalProperties: true }, type: { required: false, default: client_1.ArticleType.NEWS, enum: ["NEWS", "COLUMN", "PHOTO_GALLERY", "VIDEO"] }, spot: { required: false, type: () => String }, featuredImage: { required: false, type: () => String }, status: { required: false, enum: ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED", "IN_REVIEW"] }, categoryIds: { required: false, type: () => [String] }, tagNames: { required: false, type: () => [String] }, authorId: { required: false, type: () => String }, seoTitle: { required: false, type: () => String }, seoDesc: { required: false, type: () => String }, source: { required: false, type: () => String }, sourceUrl: { required: false, type: () => String }, featured: { required: false, type: () => Boolean }, nationalFeatured: { required: false, type: () => Boolean, description: "\u0130kinci man\u015Fet paneli \u2014 ULUSAL man\u015Fet i\u00E7in ayr\u0131 bir \u00F6ne \u00E7\u0131karma." }, headlineTitle: { required: false, type: () => String, description: "Man\u015Fette g\u00F6sterilecek \u00F6zel ba\u015Fl\u0131k \u2014 bo\u015F ise `title` kullan\u0131l\u0131r." }, headlineImage: { required: false, type: () => String, description: "Man\u015Fette g\u00F6sterilecek \u00F6zel g\u00F6rsel \u2014 bo\u015F ise `featuredImage` kullan\u0131l\u0131r." }, headlineFontSize: { required: false, type: () => Number, minimum: 12 }, headlineFontFamily: { required: false, type: () => String }, hideHeadlineOverlay: { required: false, type: () => Boolean, description: "Man\u015Fet slider'\u0131nda ve \u00F6ne \u00E7\u0131kan haber alan\u0131nda g\u00F6rselin \u00FCzerine ba\u015Fl\u0131k +\n\u00F6zet bindirilmesini kapat\u0131r. G\u00F6rselin kendisi yaz\u0131 ta\u015F\u0131yorsa (afi\u015F,\ninfografik, pankart) bindirme okunakl\u0131l\u0131\u011F\u0131 bozuyor." }, publishedAt: { required: false, type: () => String }, scheduledAt: { required: false, type: () => String }, breakingLabel: { required: false, type: () => String, nullable: true, description: "Son dakika \u015Feridi ba\u015Fl\u0131\u011F\u0131 \u2014 null ile temizlenebilir." }, assignedToId: { required: false, type: () => String, nullable: true }, deadline: { required: false, type: () => String, nullable: true }, reviewNote: { required: false, type: () => String, nullable: true } };
    }
}
exports.CreateArticleDto = CreateArticleDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ArticleType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "spot", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "featuredImage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ArticleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateArticleDto.prototype, "categoryIds", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateArticleDto.prototype, "tagNames", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "authorId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "seoDesc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "source", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "sourceUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateArticleDto.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateArticleDto.prototype, "nationalFeatured", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "headlineTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "headlineImage", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(12),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateArticleDto.prototype, "headlineFontSize", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "headlineFontFamily", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateArticleDto.prototype, "hideHeadlineOverlay", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "publishedAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateArticleDto.prototype, "scheduledAt", void 0);
__decorate([
    (0, class_validator_1.ValidateIf)((_o, v) => v !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "breakingLabel", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "assignedToId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "deadline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateArticleDto.prototype, "reviewNote", void 0);
//# sourceMappingURL=create-article.dto.js.map