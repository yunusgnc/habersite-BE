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
exports.UnreactDto = exports.ReactDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
class ReactDto {
    type;
    previous;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"] }, previous: { required: false, enum: ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"] } };
    }
}
exports.ReactDto = ReactDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ReactionType),
    __metadata("design:type", String)
], ReactDto.prototype, "type", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(client_1.ReactionType),
    __metadata("design:type", String)
], ReactDto.prototype, "previous", void 0);
class UnreactDto {
    type;
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, enum: ["LIKE", "LOVE", "HAHA", "WOW", "SAD", "ANGRY"] } };
    }
}
exports.UnreactDto = UnreactDto;
__decorate([
    (0, class_validator_1.IsEnum)(client_1.ReactionType),
    __metadata("design:type", String)
], UnreactDto.prototype, "type", void 0);
//# sourceMappingURL=react.dto.js.map