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
exports.QueryCommentsDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const client_1 = require("@prisma/client");
class QueryCommentsDto {
    articleId;
    status;
    page;
    cursor;
    limit = 20;
    static _OPENAPI_METADATA_FACTORY() {
        return { articleId: { required: false, type: () => String }, status: { required: false, enum: ["PENDING", "APPROVED", "SPAM", "REJECTED"] }, page: { required: false, type: () => Number, description: "Numaral\u0131 sayfalama \u2014 verilirse imle\u00E7 yok say\u0131l\u0131r (bkz. sayfali-liste).", minimum: 1 }, cursor: { required: false, type: () => String }, limit: { required: false, type: () => Number, default: 20, minimum: 1, maximum: 50 } };
    }
}
exports.QueryCommentsDto = QueryCommentsDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCommentsDto.prototype, "articleId", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.CommentStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCommentsDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCommentsDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], QueryCommentsDto.prototype, "cursor", void 0);
__decorate([
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(50),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], QueryCommentsDto.prototype, "limit", void 0);
//# sourceMappingURL=query-comments.dto.js.map