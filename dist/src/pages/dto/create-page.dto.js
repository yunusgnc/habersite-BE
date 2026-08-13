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
exports.UpdatePageDto = exports.CreatePageDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePageDto {
    title;
    slug;
    content;
    seoTitle;
    seoDesc;
    published;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 2 }, slug: { required: false, type: () => String, description: "URL slug. If omitted, the service auto-generates one from `title`." }, content: { required: true, type: () => Object, description: "Rich content. Accepts a Tiptap HTML string OR a structured JSON object \u2014\nthe service stores whatever it receives in a `content` Json column." }, seoTitle: { required: false, type: () => String }, seoDesc: { required: false, type: () => String }, published: { required: false, type: () => Boolean } };
    }
}
exports.CreatePageDto = CreatePageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreatePageDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePageDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], CreatePageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePageDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreatePageDto.prototype, "seoDesc", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePageDto.prototype, "published", void 0);
class UpdatePageDto {
    title;
    slug;
    content;
    seoTitle;
    seoDesc;
    published;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: false, type: () => String, minLength: 2 }, slug: { required: false, type: () => String }, content: { required: false, type: () => Object }, seoTitle: { required: false, type: () => String }, seoDesc: { required: false, type: () => String }, published: { required: false, type: () => Boolean } };
    }
}
exports.UpdatePageDto = UpdatePageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UpdatePageDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePageDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdatePageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePageDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdatePageDto.prototype, "seoDesc", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdatePageDto.prototype, "published", void 0);
//# sourceMappingURL=create-page.dto.js.map