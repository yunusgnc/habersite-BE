import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthorCategoryDto } from './create-author-category.dto';

export class UpdateAuthorCategoryDto extends PartialType(CreateAuthorCategoryDto) {}
