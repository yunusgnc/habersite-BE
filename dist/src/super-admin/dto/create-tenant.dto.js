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
exports.CreateTenantDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateTenantDto {
    name;
    slug;
    domain;
    subdomain;
    logo;
    plan;
    city;
    primaryColor;
    adminName;
    adminEmail;
    adminUsername;
    adminPassword;
    bootstrapDefaults;
    locale;
    timezone;
    static _OPENAPI_METADATA_FACTORY() {
        return { name: { required: true, type: () => String, description: "M\u00FC\u015Fterinin site ad\u0131 \u2014 \u00F6r. \"Kayseri G\u00FCndem\"", minLength: 2 }, slug: { required: true, type: () => String, description: "URL-dostu benzersiz kimlik \u2014 \u00F6r. \"kayseri-gundem\"", pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$" }, domain: { required: false, type: () => String, description: "M\u00FC\u015Fterinin kendi domaini \u2014 \u00F6r. \"www.kayserigundem.com\"" }, subdomain: { required: false, type: () => String, description: "Platform alt alan ad\u0131 \u2014 \u00F6r. \"kayserigundem\" (kayserigundem.habersite.com)" }, logo: { required: false, type: () => String }, plan: { required: false, type: () => String }, city: { required: false, type: () => String, description: "Widget'lar i\u00E7in varsay\u0131lan \u015Fehir" }, primaryColor: { required: false, type: () => String, description: "Tema ana rengi \u2014 \u00F6r. \"#bc1010\"" }, adminName: { required: true, type: () => String, minLength: 2 }, adminEmail: { required: true, type: () => String, format: "email" }, adminUsername: { required: false, type: () => String, pattern: "^[a-z0-9._-]+$" }, adminPassword: { required: true, type: () => String, minLength: 8 }, bootstrapDefaults: { required: false, type: () => Boolean, description: "Varsay\u0131lan i\u00E7erikleri (widget, ayar) otomatik olu\u015Ftur" }, locale: { required: false, type: () => String, description: "ISO 639-1 dil kodu \u2014 html lang, JSON-LD ve OG i\u00E7in", pattern: "^[a-z]{2}(?:-[A-Z]{2})?$" }, timezone: { required: false, type: () => String, description: "IANA timezone \u2014 \u00F6r. \"Europe/Istanbul\"" } };
    }
}
exports.CreateTenantDto = CreateTenantDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'slug yalnızca küçük harf, rakam ve tire içerebilir',
    }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "domain", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "subdomain", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "logo", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "plan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "city", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "primaryColor", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminEmail", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[a-z0-9._-]+$/, {
        message: 'kullanıcı adı yalnızca küçük harf, rakam, nokta, alt çizgi ve tire içerebilir',
    }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminUsername", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "adminPassword", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateTenantDto.prototype, "bootstrapDefaults", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[a-z]{2}(?:-[A-Z]{2})?$/, {
        message: 'locale ISO 639-1 formatında olmalı (ör. "tr", "en", "tr-TR")',
    }),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "locale", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "timezone", void 0);
//# sourceMappingURL=create-tenant.dto.js.map