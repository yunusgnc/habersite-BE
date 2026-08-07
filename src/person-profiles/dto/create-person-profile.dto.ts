import {
  IsString,
  IsOptional,
  IsObject,
} from 'class-validator';

export class CreatePersonProfileDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  birthDate?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  social?: Record<string, any>;
}
