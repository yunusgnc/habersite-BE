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
exports.CreateAdDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class CreateAdDto {
    name;
    position;
    code;
    imageUrl;
    mobileImageUrl;
    targetUrl;
    active;
    startsAt;
    endsAt;
    sortOrder;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String }, position: { required: true, enum: ["HEADER_TOP", "FOOTER_BOTTOM", "SITE_TOWER_LEFT", "SITE_TOWER_RIGHT", "HOME_SLIDER_UNDER", "HOME_MIDDLE_1", "HOME_MIDDLE_2", "HOME_MIDDLE_3", "HOME_MIDDLE_4", "HOME_BOTTOM", "CATEGORY_MIDDLE_1", "CATEGORY_MIDDLE_2", "ARTICLE_TOP", "ARTICLE_IN_TEXT_1", "ARTICLE_BOTTOM", "ARTICLE_SIDEBAR_1", "ARTICLE_SIDEBAR_2", "VIDEO_LIST_TOP", "VIDEO_LIST_BOTTOM", "VIDEO_DETAIL_TOP"] }, code: { required: false, type: () => String }, imageUrl: { required: false, type: () => String }, mobileImageUrl: { required: false, type: () => String }, targetUrl: { required: false, type: () => String }, active: { required: false, type: () => Boolean }, startsAt: { required: false, type: () => String }, endsAt: { required: false, type: () => String }, sortOrder: { required: false, type: () => Number } };
    }
}
exports.CreateAdDto = CreateAdDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.AdPosition),
    __metadata("design:type", String)
], CreateAdDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "imageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "mobileImageUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "targetUrl", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateAdDto.prototype, "active", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAdDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateAdDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=create-ad.dto.js.map