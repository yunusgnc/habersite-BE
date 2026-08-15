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
exports.QueryArticlesDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class QueryArticlesDto {
    cursor;
    page;
    limit = 20;
    status;
    type;
    categorySlug;
    categoryId;
    authorSlug;
    search;
    searchScope;
    from;
    to;
    tagSlug;
    featured;
    createdById;
    sort = 'latest';
    static _OPENAPI_METADATA_FACTORY() {
        return { cursor: { required: false, type: () => String }, page: { required: false, type: () => Number, description: "1'den ba\u015Flayan sayfa numaras\u0131. Verilirse cursor yerine offset kullan\u0131l\u0131r.\nKategori/ar\u015Fiv sayfalar\u0131nda gerekli: arama motorlar\u0131n\u0131n derin sayfalar\u0131\ntarayabilmesi i\u00E7in adresin (?sayfa=3) kal\u0131c\u0131 ve payla\u015F\u0131labilir olmas\u0131 \u015Fart,\ncursor bunu sa\u011Flam\u0131yor.", minimum: 1 }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 50 }, status: { required: false, enum: ["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"] }, type: { required: false, enum: ["NEWS", "COLUMN", "PHOTO_GALLERY", "VIDEO"] }, categorySlug: { required: false, type: () => String }, categoryId: { required: false, type: () => String }, authorSlug: { required: false, type: () => String }, search: { required: false, type: () => String }, searchScope: { required: false, description: "Arama kapsam\u0131: 'title' (varsay\u0131lan) yaln\u0131zca ba\u015Fl\u0131k, 'all' ba\u015Fl\u0131k+\u00F6zet+i\u00E7erik+etiket.", enum: ["title", "all"] }, from: { required: false, type: () => String, description: "Ar\u015Fiv filtresi \u2014 yay\u0131n tarihi bu tarihten itibaren (ISO)." }, to: { required: false, type: () => String, description: "Ar\u015Fiv filtresi \u2014 yay\u0131n tarihi bu tarihe kadar (ISO, g\u00FCn sonu dahil)." }, tagSlug: { required: false, type: () => String, description: "Etiket slug'\u0131na g\u00F6re filtre \u2014 /etiket/[slug] sayfas\u0131 i\u00E7in." }, featured: { required: false, type: () => String }, createdById: { required: false, type: () => String, description: "Filter by the user who created the article (audit filter)." }, sort: { required: false, type: () => String, default: "latest" } };
    }
}
exports.QueryArticlesDto = QueryArticlesDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "cursor", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryArticlesDto.prototype, "page", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryArticlesDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ArticleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ArticleType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "categorySlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "authorSlug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "searchScope", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "tagSlug", void 0);
__decorate([
    (0, class_validator_1.IsBooleanString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "featured", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "createdById", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryArticlesDto.prototype, "sort", void 0);
//# sourceMappingURL=query-articles.dto.js.map