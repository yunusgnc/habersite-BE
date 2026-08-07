import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { MenuItemDto } from './update-menu.dto';

export class CreateMenuDto {
  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  label?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuItemDto)
  items: MenuItemDto[];
}
