import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAuthorCategoryDto {
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
