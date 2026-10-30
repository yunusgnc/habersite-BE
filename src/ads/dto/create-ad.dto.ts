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
  Max,
  ValidateIf,
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

  /**
   * HOME_SLIDER_INSIDE reklamının düşeceği boşluk: 1 → 5. haberden sonra,
   * 2 → 10., 3 → 15., 4 → 20. null/boş → reklam havuzu boşlukları sırayla
   * doldurur (eski davranış). null gönderilebilsin ki "Otomatik"e dönülebilsin.
   */
  @ValidateIf((o) => o.sliderSlot !== null && o.sliderSlot !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(4)
  @IsOptional()
  sliderSlot?: number | null;

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
