"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePopupDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_popup_dto_1 = require("./create-popup.dto");
class UpdatePopupDto extends (0, mapped_types_1.PartialType)(create_popup_dto_1.CreatePopupDto) {
}
exports.UpdatePopupDto = UpdatePopupDto;
//# sourceMappingURL=update-popup.dto.js.map