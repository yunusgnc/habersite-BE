import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Karikatür girişi. ZORUNLU olan yalnızca `title` ve `image` — karikatürün
 * kendisi görsel, açıklaması olmayabilir.
 */
export class CreateCartoonDto {
  @IsString()
  @MinLength(2)
  @MaxLength(300)
  title: string;

  /// Verilmezse başlıktan türetilir.
  @IsString()
  @IsOptional()
  @MaxLength(300)
  slug?: string;

  @IsString()
  @MinLength(1)
  @MaxLength(1000)
  image: string;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  imageAlt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  artist?: string;

  @IsString()
  @IsOptional()
  @MaxLength(4000)
  caption?: string;

  @IsString()
  @IsOptional()
  @IsIn(['normal', 'large', 'xlarge'])
  captionSize?: 'normal' | 'large' | 'xlarge';

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(300)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  seoDesc?: string;
}
