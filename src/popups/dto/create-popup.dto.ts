import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePopupDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  targetUrl?: string;

  @IsString()
  @IsOptional()
  trigger?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  delayMs?: number;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsDateString()
  @IsOptional()
  startsAt?: string;

  @IsDateString()
  @IsOptional()
  endsAt?: string;
}
