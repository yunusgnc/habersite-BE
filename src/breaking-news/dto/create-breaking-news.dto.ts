import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBreakingNewsDto {
  @IsString()
  title: string;

  @IsUrl()
  @IsOptional()
  url?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
