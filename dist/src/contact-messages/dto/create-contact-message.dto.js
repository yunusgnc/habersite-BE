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
exports.CreateContactMessageDto = void 0;
const openapi = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const class_validator_1 = require("class-validator");
class CreateContactMessageDto {
    type;
    name;
    email;
    phone;
    subject;
    message;
    targetUrl;
    district;
    attachments;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: false, enum: ["CONTACT", "TIP", "REMOVAL_REQUEST"] }, name: { required: true, type: () => String, minLength: 2, maxLength: 120 }, email: { required: true, type: () => String, format: "email" }, phone: { required: false, type: () => String, maxLength: 40 }, subject: { required: false, type: () => String, maxLength: 200 }, message: { required: true, type: () => String, minLength: 5, maxLength: 5000 }, targetUrl: { required: false, type: () => String, maxLength: 500, format: "uri" }, district: { required: false, type: () => String, maxLength: 120 }, attachments: { required: false, type: () => [String], maxItems: 6 } };
    }
}
exports.CreateContactMessageDto = CreateContactMessageDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.MessageType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(40),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsUrl)({ require_protocol: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "targetUrl", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], CreateContactMessageDto.prototype, "district", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ArrayMaxSize)(6),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateContactMessageDto.prototype, "attachments", void 0);
//# sourceMappingURL=create-contact-message.dto.js.map