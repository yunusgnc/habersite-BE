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
exports.UpdateRssSourceDto = exports.CreateRssSourceDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateRssSourceDto {
    name;
    url;
    defaultCategoryId;
    defaultAuthorName;
    active;
    fetchIntervalMinutes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, minLength: 2, maxLength: 120 }, url: { required: true, type: () => String, format: "uri" }, defaultCategoryId: { required: false, type: () => String }, defaultAuthorName: { required: false, type: () => String, maxLength: 120 }, active: { required: false, type: () => Boolean }, fetchIntervalMinutes: { required: false, type: () => Number, minimum: 5, maximum: 1440 } };
    }
}
exports.CreateRssSourceDto = CreateRssSourceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateRssSourceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    __metadata("design:type", String)
], CreateRssSourceDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRssSourceDto.prototype, "defaultCategoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateRssSourceDto.prototype, "defaultAuthorName", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateRssSourceDto.prototype, "active", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], CreateRssSourceDto.prototype, "fetchIntervalMinutes", void 0);
class UpdateRssSourceDto {
    name;
    url;
    defaultCategoryId;
    defaultAuthorName;
    active;
    fetchIntervalMinutes;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: false, type: () => String, minLength: 2, maxLength: 120 }, url: { required: false, type: () => String, format: "uri" }, defaultCategoryId: { required: false, type: () => String, nullable: true }, defaultAuthorName: { required: false, type: () => String, nullable: true, maxLength: 120 }, active: { required: false, type: () => Boolean }, fetchIntervalMinutes: { required: false, type: () => Number, minimum: 5, maximum: 1440 } };
    }
}
exports.UpdateRssSourceDto = UpdateRssSourceDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], UpdateRssSourceDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateRssSourceDto.prototype, "url", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateRssSourceDto.prototype, "defaultCategoryId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", Object)
], UpdateRssSourceDto.prototype, "defaultAuthorName", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateRssSourceDto.prototype, "active", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(1440),
    __metadata("design:type", Number)
], UpdateRssSourceDto.prototype, "fetchIntervalMinutes", void 0);
//# sourceMappingURL=rss-source.dto.js.map