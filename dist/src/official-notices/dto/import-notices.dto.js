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
exports.ImportNoticesDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ImportNoticesDto {
    categorySlug;
    dryRun;
    expireAfterDays;
    static _OPENAPI_METADATA_FACTORY() {
        return { categorySlug: { required: true, type: () => String, description: "Aktar\u0131lacak kategorinin adres par\u00E7as\u0131, \u00F6r. \"resmi-reklamlar\"." }, dryRun: { required: false, type: () => Boolean, description: "true \u2192 hi\u00E7bir \u015Fey yaz\u0131lmaz, yaln\u0131zca ne olaca\u011F\u0131 d\u00F6ner." }, expireAfterDays: { required: false, type: () => Number, description: "\u0130lan\u0131n yay\u0131ndan ka\u00E7 g\u00FCn sonra ar\u015Five d\u00FC\u015Fece\u011Fi. Kaynak haberlerde son\nba\u015Fvuru tarihi tutulmuyor; tarih ancak b\u00F6yle t\u00FCretilebiliyor.", minimum: 1, maximum: 3650 } };
    }
}
exports.ImportNoticesDto = ImportNoticesDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ImportNoticesDto.prototype, "categorySlug", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ImportNoticesDto.prototype, "dryRun", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(3650),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], ImportNoticesDto.prototype, "expireAfterDays", void 0);
//# sourceMappingURL=import-notices.dto.js.map