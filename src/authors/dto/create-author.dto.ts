import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsObject,
  IsBoolean,
  IsInt,
  IsEnum,
} from 'class-validator';
import { AuthorGroup } from '@prisma/client';

export class CreateAuthorDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsObject()
  @IsOptional()
  social?: Record<string, string>;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  /** STAFF = Yazarlar, OTHER = Diğer Yazarlar, GUEST = Misafir Yazarlar. */
  @IsEnum(AuthorGroup)
  @IsOptional()
  group?: AuthorGroup;

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
