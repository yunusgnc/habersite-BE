"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePersonProfileDto = void 0;
const openapi = require("@nestjs/swagger");
const mapped_types_1 = require("@nestjs/mapped-types");
const create_person_profile_dto_1 = require("./create-person-profile.dto");
class UpdatePersonProfileDto extends (0, mapped_types_1.PartialType)(create_person_profile_dto_1.CreatePersonProfileDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePersonProfileDto = UpdatePersonProfileDto;
//# sourceMappingURL=update-person-profile.dto.js.map