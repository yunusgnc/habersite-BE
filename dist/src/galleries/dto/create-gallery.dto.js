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
exports.CreateGalleryDto = exports.CreateGalleryImageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateGalleryImageDto {
    url;
    caption;
    credit;
    alt;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String }, caption: { required: false, type: () => String }, credit: { required: false, type: () => String }, alt: { required: false, type: () => String }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateGalleryImageDto = CreateGalleryImageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGalleryImageDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryImageDto.prototype, "caption", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryImageDto.prototype, "credit", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryImageDto.prototype, "alt", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateGalleryImageDto.prototype, "sortOrder", void 0);
class CreateGalleryDto {
    title;
    headline;
    slug;
    description;
    coverImage;
    categoryId;
    status;
    publishedAt;
    sortOrder;
    images;
    seoTitle;
    seoDesc;
    seoKeywords;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String }, headline: { required: false, type: () => String }, slug: { required: false, type: () => String }, description: { required: false, type: () => String }, coverImage: { required: false, type: () => String }, categoryId: { required: false, type: () => String }, status: { required: false, enum: ["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"] }, publishedAt: { required: false, type: () => String }, sortOrder: { required: false, type: () => Number }, images: { required: false, type: () => [require("./create-gallery.dto").CreateGalleryImageDto] }, seoTitle: { required: false, type: () => String }, seoDesc: { required: false, type: () => String }, seoKeywords: { required: false, type: () => String } };
    }
}
exports.CreateGalleryDto = CreateGalleryDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "headline", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "coverImage", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "categoryId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ArticleStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "publishedAt", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateGalleryDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateGalleryImageDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateGalleryDto.prototype, "images", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "seoDesc", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGalleryDto.prototype, "seoKeywords", void 0);
//# sourceMappingURL=create-gallery.dto.js.map