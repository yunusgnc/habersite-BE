"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthorCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_author_category_dto_1 = require("./create-author-category.dto");
class UpdateAuthorCategoryDto extends (0, mapped_types_1.PartialType)(create_author_category_dto_1.CreateAuthorCategoryDto) {
}
exports.UpdateAuthorCategoryDto = UpdateAuthorCategoryDto;
//# sourceMappingURL=update-author-category.dto.js.map