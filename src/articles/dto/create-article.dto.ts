import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleType, ArticleStatus } from '@prisma/client';

export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  title: string;

  /**
   * Haberin adres parçası. Boş bırakılırsa başlıktan türetilir.
   *
   * Panel bu alanı gönderiyordu ama burada karşılığı yoktu; doğrulama katmanı
   * onu sessizce düşürüyor ve slug her zaman başlıktan üretiliyordu. Editörün
   * yazdığı adres kayboluyordu — SEO açısından önemli bir alanda sessiz veri
   * kaybı.
   */
  @IsString()
  @IsOptional()
  slug?: string;

  @IsObject()
  content: Record<string, any>;

  @IsEnum(ArticleType)
  @IsOptional()
  type?: ArticleType = ArticleType.NEWS;

  @IsString()
  @IsOptional()
  spot?: string;

  @IsString()
  @IsOptional()
  featuredImage?: string;

  /** Haberin YouTube video adresi (ayrı alan; içerik editöründen bağımsız). */
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagNames?: string[];

  @IsString()
  @IsOptional()
  authorId?: string;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDesc?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsString()
  @IsOptional()
  sourceUrl?: string;

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  /** İkinci manşet paneli — ULUSAL manşet için ayrı bir öne çıkarma. */
  @IsBoolean()
  @IsOptional()
  nationalFeatured?: boolean;

  /** Manşette gösterilecek özel başlık — boş ise `title` kullanılır. */
  @IsString()
  @IsOptional()
  headlineTitle?: string;

  /** Manşette gösterilecek özel görsel — boş ise `featuredImage` kullanılır. */
  @IsString()
  @IsOptional()
  headlineImage?: string;

  @IsInt()
  @Min(12)
  @IsOptional()
  headlineFontSize?: number;

  @IsString()
  @IsOptional()
  headlineFontFamily?: string;

  /**
   * Manşet slider'ında ve öne çıkan haber alanında görselin üzerine başlık +
   * özet bindirilmesini kapatır. Görselin kendisi yazı taşıyorsa (afiş,
   * infografik, pankart) bindirme okunaklılığı bozuyor.
   */
  @IsBoolean()
  @IsOptional()
  hideHeadlineOverlay?: boolean;

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  /** Son dakika şeridi başlığı — null ile temizlenebilir. */
  @ValidateIf((_o, v) => v !== null)
  @IsString()
  @IsOptional()
  breakingLabel?: string | null;

  // ---- editorial workflow ----

  @IsString()
  @IsOptional()
  assignedToId?: string | null;

  @IsDateString()
  @IsOptional()
  deadline?: string | null;

  @IsString()
  @IsOptional()
  reviewNote?: string | null;
}
