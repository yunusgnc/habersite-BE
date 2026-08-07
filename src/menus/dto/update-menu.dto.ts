import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class MenuItemDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsString()
  @IsOptional()
  url?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  order?: number;
}

export class UpdateMenuDto {
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items?: MenuItemDto[];

  @IsString()
  @IsOptional()
  @MaxLength(100)
  label?: string;
}
