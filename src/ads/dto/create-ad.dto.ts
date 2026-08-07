import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdPosition } from '@prisma/client';

export class CreateAdDto {
  @IsString()
  name: string;

  @IsEnum(AdPosition)
  position: AdPosition;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  mobileImageUrl?: string;

  @IsString()
  @IsOptional()
  targetUrl?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDateString()
  @IsOptional()
  startsAt?: string;

  @IsDateString()
  @IsOptional()
  endsAt?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
