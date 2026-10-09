import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  IsDateString,
  IsArray,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdPosition } from '@prisma/client';

export class CreateAdDto {
  @IsString()
  name: string;

  /**
   * Birincil pozisyon — geriye dönük uyumluluk. Yeni istemci `positions`
   * gönderir; service ikisinden birini bekler (en az bir pozisyon şart).
   */
  @IsEnum(AdPosition)
  @IsOptional()
  position?: AdPosition;

  /** Reklamın gösterileceği tüm pozisyonlar (çoklu seçim). */
  @IsArray()
  @IsEnum(AdPosition, { each: true })
  @ArrayMinSize(1)
  @IsOptional()
  positions?: AdPosition[];

  /** Slider içinde bu reklamın görünme süresi (saniye). */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  sliderSeconds?: number;

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
