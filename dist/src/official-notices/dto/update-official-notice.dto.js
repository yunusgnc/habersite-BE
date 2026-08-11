"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateOfficialNoticeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_official_notice_dto_1 = require("./create-official-notice.dto");
class UpdateOfficialNoticeDto extends (0, mapped_types_1.PartialType)(create_official_notice_dto_1.CreateOfficialNoticeDto) {
}
exports.UpdateOfficialNoticeDto = UpdateOfficialNoticeDto;
//# sourceMappingURL=update-official-notice.dto.js.map