"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = void 0;
const openapi = require("@nestjs/swagger");
class AuthResponseDto {
    accessToken;
    tenantId;
    user;
    static _OPENAPI_METADATA_FACTORY() {
        return { accessToken: { required: true, type: () => String }, tenantId: { required: true, type: () => String }, user: { required: true, type: () => ({ id: { required: true, type: () => String }, name: { required: true, type: () => String }, email: { required: true, type: () => String }, role: { required: true, type: () => String }, avatar: { required: true, type: () => String, nullable: true } }) } };
    }
}
exports.AuthResponseDto = AuthResponseDto;
//# sourceMappingURL=auth-response.dto.js.map