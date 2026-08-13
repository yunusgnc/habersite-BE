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
exports.ListCampaignsQuery = exports.UpdateCampaignDto = exports.CreateCampaignDto = exports.NewsletterCampaignStatus = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var NewsletterCampaignStatus;
(function (NewsletterCampaignStatus) {
    NewsletterCampaignStatus["DRAFT"] = "DRAFT";
    NewsletterCampaignStatus["SCHEDULED"] = "SCHEDULED";
    NewsletterCampaignStatus["SENDING"] = "SENDING";
    NewsletterCampaignStatus["SENT"] = "SENT";
    NewsletterCampaignStatus["FAILED"] = "FAILED";
})(NewsletterCampaignStatus || (exports.NewsletterCampaignStatus = NewsletterCampaignStatus = {}));
class CreateCampaignDto {
    subject;
    preheader;
    htmlBody;
    textBody;
    status;
    scheduledAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { subject: { required: true, type: () => String, minLength: 2, maxLength: 200 }, preheader: { required: false, type: () => String, maxLength: 200 }, htmlBody: { required: true, type: () => String, description: "HTML g\u00F6vde \u2014 TipTap/wysiwyg \u00E7\u0131k\u0131\u015F\u0131 beklenir", minLength: 1 }, textBody: { required: false, type: () => String }, status: { required: false, description: "DRAFT default; SCHEDULED i\u00E7in scheduledAt zorunlu", enum: require("./newsletter-campaign.dto").NewsletterCampaignStatus }, scheduledAt: { required: false, type: () => String } };
    }
}
exports.CreateCampaignDto = CreateCampaignDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "preheader", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "htmlBody", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "textBody", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NewsletterCampaignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCampaignDto.prototype, "scheduledAt", void 0);
class UpdateCampaignDto {
    subject;
    preheader;
    htmlBody;
    textBody;
    status;
    scheduledAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { subject: { required: false, type: () => String, minLength: 2, maxLength: 200 }, preheader: { required: false, type: () => String, maxLength: 200 }, htmlBody: { required: false, type: () => String }, textBody: { required: false, type: () => String }, status: { required: false, enum: require("./newsletter-campaign.dto").NewsletterCampaignStatus }, scheduledAt: { required: false, type: () => String, nullable: true } };
    }
}
exports.UpdateCampaignDto = UpdateCampaignDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "preheader", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "htmlBody", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "textBody", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NewsletterCampaignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateCampaignDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateCampaignDto.prototype, "scheduledAt", void 0);
class ListCampaignsQuery {
    page;
    perPage;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { page: { required: false, type: () => Number, minimum: 1 }, perPage: { required: false, type: () => Number, minimum: 1 }, status: { required: false, enum: require("./newsletter-campaign.dto").NewsletterCampaignStatus } };
    }
}
exports.ListCampaignsQuery = ListCampaignsQuery;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ListCampaignsQuery.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ListCampaignsQuery.prototype, "perPage", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(NewsletterCampaignStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ListCampaignsQuery.prototype, "status", void 0);
//# sourceMappingURL=newsletter-campaign.dto.js.map