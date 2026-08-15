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
exports.BulkUpdateSettingsDto = exports.UpdateSettingDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSettingDto {
    value;
    static _OPENAPI_METADATA_FACTORY() {
        return { value: { required: true, type: () => Object, description: "`IsNotEmpty` de\u011Fil `IsDefined`: bo\u015F de\u011Fer ge\u00E7erli bir istek \u2014 \"bu ayar\u0131\ntemizle\" demek ve servis onu kayd\u0131 silerek kar\u015F\u0131l\u0131yor (API anahtar\u0131 Sil\nbutonunun yolu bu). `IsNotEmpty` bo\u015F de\u011Feri servise hi\u00E7 ula\u015Ft\u0131rmad\u0131\u011F\u0131 i\u00E7in\nsilme ak\u0131\u015F\u0131 \u00E7al\u0131\u015Fm\u0131yordu. Alan\u0131n g\u00F6vdede bulunmas\u0131 yine zorunlu, b\u00F6ylece\neksik `value` sessizce silmeye d\u00F6n\u00FC\u015Fm\u00FCyor." } };
    }
}
exports.UpdateSettingDto = UpdateSettingDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", Object)
], UpdateSettingDto.prototype, "value", void 0);
class BulkUpdateSettingsDto {
    settings;
    static _OPENAPI_METADATA_FACTORY() {
        return { settings: { required: true, type: "object", additionalProperties: true } };
    }
}
exports.BulkUpdateSettingsDto = BulkUpdateSettingsDto;
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], BulkUpdateSettingsDto.prototype, "settings", void 0);
//# sourceMappingURL=update-settings.dto.js.map