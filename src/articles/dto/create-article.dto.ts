import {
  IsString,
  IsOptional,
  IsIn,
  IsEnum,
  IsObject,
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNumber,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Transform } from 'class-transformer';
import { ArticleType, ArticleStatus } from '@prisma/client';
import { duzMetneCevir } from '../../common/plain-text';

export const MANSET_FONTLARI = [
  'merriweather',
  'playfair',
  'roboto-slab',
  'oswald',
  'montserrat',
  'serif',
  'sans',
  'condensed',
] as const;

/** Desteklenen sosyal ağlar — SocialShareService'teki dallarla aynı adlar. */
export const PAYLASIM_AGLARI = [
  'telegram',
  'facebook',
  'instagram',
  'x',
] as const;

export class CreateArticleDto {
  @Transform(({ value }) => duzMetneCevir(value))
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

  @Transform(({ value }) => duzMetneCevir(value))
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

  /**
   * Bu haber hangi sosyal ağlara gönderilsin.
   *
   * Gönderilmezse (undefined) davranış eskisi gibi: ayarlarda AÇIK olan tüm
   * ağlar. Boş dizi "hiçbiri" demek — editör paylaşımı bilinçli kapattı.
   */
  @IsArray()
  @IsIn(PAYLASIM_AGLARI, { each: true })
  @IsOptional()
  shareTargets?: string[];

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

  @Transform(({ value }) => duzMetneCevir(value))
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @Transform(({ value }) => duzMetneCevir(value))
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
  @Transform(({ value }) => duzMetneCevir(value))
  @IsString()
  @IsOptional()
  headlineTitle?: string;

  /** Manşette gösterilecek özel görsel — boş ise `featuredImage` kullanılır. */
  @IsString()
  @IsOptional()
  headlineImage?: string;

  /** Manşette görselin ortasındaki kısa satır — boşsa gösterilmez. */
  @Transform(({ value }) => duzMetneCevir(value))
  @IsString()
  @MaxLength(160)
  @IsOptional()
  spotTitle?: string;

  @IsIn(MANSET_FONTLARI)
  @IsOptional()
  spotTitleFontFamily?: string;

  @IsInt()
  @Min(12)
  @Max(96)
  @IsOptional()
  spotTitleFontSize?: number;

  /** Manşet görseli içinde yüzde tabanlı spot başlık merkezi ve kutu genişliği. */
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  spotTitleX?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  spotTitleY?: number;

  @IsNumber()
  @Min(20)
  @Max(96)
  @IsOptional()
  spotTitleWidth?: number;

  @IsInt()
  @Min(12)
  @Max(96)
  @IsOptional()
  headlineFontSize?: number;

  /** Manşet başlığının görsel içindeki yüzde tabanlı merkezi ve kutu genişliği. */
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  headlineX?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  headlineY?: number;

  @IsNumber()
  @Min(20)
  @Max(96)
  @IsOptional()
  headlineWidth?: number;

  /**
   * Manşet görselinin yakınlaştırması ve odak noktası. 1 = dokunulmamış.
   * Üst sınır 3: daha fazlası devralınan arşivdeki görsellerde bozulma
   * yapıyor, ölçüldü.
   */
  @IsNumber()
  @Min(1)
  @Max(3)
  @IsOptional()
  headlineImageScale?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  headlineImageX?: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  headlineImageY?: number;

  /**
   * Manşet yazı tipi anahtarı. Site anahtarı kendi font listesine çeviriyor;
   * serbest metin kabul edilmiyor. `serif` / `sans` / `condensed` eski
   * panelin değerleri — kayıtlı haberler bozulmasın diye geçerli.
   */
  @IsIn(MANSET_FONTLARI)
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
  @Transform(({ value }) => duzMetneCevir(value))
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
