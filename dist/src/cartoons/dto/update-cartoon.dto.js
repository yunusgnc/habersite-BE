"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCartoonDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_cartoon_dto_1 = require("./create-cartoon.dto");
class UpdateCartoonDto extends (0, mapped_types_1.PartialType)(create_cartoon_dto_1.CreateCartoonDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCartoonDto = UpdateCartoonDto;
//# sourceMappingURL=update-cartoon.dto.js.map