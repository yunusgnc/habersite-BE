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
exports.AssistDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const ai_tasks_1 = require("../ai.tasks");
class AssistDto {
    task;
    title;
    content;
    spot;
    static _OPENAPI_METADATA_FACTORY() {
        return { task: { required: true, enum: ["spot", "tags", "seo", "titles"], enum: ai_tasks_1.AI_TASK_NAMES }, title: { required: true, type: () => String, maxLength: 500 }, content: { required: false, type: () => String, description: "Edit\u00F6rden gelen HTML. Servis d\u00FCz metne \u00E7evirip k\u0131rp\u0131yor; \u00FCst s\u0131n\u0131r burada\nyaln\u0131zca a\u015F\u0131r\u0131 b\u00FCy\u00FCk g\u00F6vdelerin iste\u011Fi \u015Fi\u015Firmesini engellemek i\u00E7in.", maxLength: 200000 }, spot: { required: false, type: () => String, maxLength: 2000 } };
    }
}
exports.AssistDto = AssistDto;
__decorate([
    (0, class_validator_1.IsIn)(ai_tasks_1.AI_TASK_NAMES),
    __metadata("design:type", String)
], AssistDto.prototype, "task", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AssistDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(200_000),
    __metadata("design:type", String)
], AssistDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2000),
    __metadata("design:type", String)
], AssistDto.prototype, "spot", void 0);
//# sourceMappingURL=assist.dto.js.map