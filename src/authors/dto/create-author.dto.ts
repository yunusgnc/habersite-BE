import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
  IsObject,
  IsBoolean,
  IsInt,
} from 'class-validator';

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

  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
