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
exports.CreateOfficialNoticeDto = exports.NoticeAttachmentDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class NoticeAttachmentDto {
    url;
    name;
    static _OPENAPI_METADATA_FACTORY() {
        return { url: { required: true, type: () => String, maxLength: 1000 }, name: { required: false, type: () => String, maxLength: 200 } };
    }
}
exports.NoticeAttachmentDto = NoticeAttachmentDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], NoticeAttachmentDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], NoticeAttachmentDto.prototype, "name", void 0);
class CreateOfficialNoticeDto {
    title;
    slug;
    noticeType;
    institution;
    referenceNo;
    summary;
    content;
    attachments;
    publishedAt;
    expiresAt;
    active;
    static _OPENAPI_METADATA_FACTORY() {
        return { title: { required: true, type: () => String, minLength: 3, maxLength: 300 }, slug: { required: false, type: () => String, maxLength: 300 }, noticeType: { required: false, enum: ["OTHER", "TENDER", "AUCTION", "RECRUITMENT", "ZONING", "COURT", "ANNOUNCEMENT"] }, institution: { required: true, type: () => String, minLength: 2, maxLength: 200 }, referenceNo: { required: false, type: () => String, maxLength: 120 }, summary: { required: false, type: () => String, maxLength: 4000 }, content: { required: false, type: () => String, description: "Zengin metin g\u00F6vdesi \u2014 ARTIK KULLANILMIYOR.\n\nResmi ilan formu sadele\u015Ftirildi: ilan\u0131n anlat\u0131m\u0131 `summary`, belgesi ise\n`attachments` \u00FCzerinden giriliyor. Alan \u015Femada duruyor ki eski ilanlar\u0131n\ng\u00F6vdesi kaybolmas\u0131n; yeni kay\u0131tlarda bo\u015F ge\u00E7iliyor." }, attachments: { required: false, type: () => [require("./create-official-notice.dto").NoticeAttachmentDto] }, publishedAt: { required: false, type: () => String }, expiresAt: { required: false, type: () => String, nullable: true }, active: { required: false, type: () => Boolean } };
    }
}
exports.CreateOfficialNoticeDto = CreateOfficialNoticeDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(300),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.NoticeType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "noticeType", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "institution", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "referenceNo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => NoticeAttachmentDto),
    __metadata("design:type", Array)
], CreateOfficialNoticeDto.prototype, "attachments", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOfficialNoticeDto.prototype, "publishedAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOfficialNoticeDto.prototype, "expiresAt", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateOfficialNoticeDto.prototype, "active", void 0);
//# sourceMappingURL=create-official-notice.dto.js.map