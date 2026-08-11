import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBooleanString,
  IsDateString,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleStatus, ArticleType } from '@prisma/client';

export class QueryArticlesDto {
  @IsString()
  @IsOptional()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsEnum(ArticleType)
  @IsOptional()
  type?: ArticleType;

  @IsString()
  @IsOptional()
  categorySlug?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsString()
  @IsOptional()
  authorSlug?: string;

  @IsString()
  @IsOptional()
  search?: string;

  /** Arama kapsamı: 'title' (varsayılan) yalnızca başlık, 'all' başlık+özet+içerik+etiket. */
  @IsString()
  @IsOptional()
  searchScope?: 'title' | 'all';

  /** Arşiv filtresi — yayın tarihi bu tarihten itibaren (ISO). */
  @IsDateString()
  @IsOptional()
  from?: string;

  /** Arşiv filtresi — yayın tarihi bu tarihe kadar (ISO, gün sonu dahil). */
  @IsDateString()
  @IsOptional()
  to?: string;

  /** Etiket slug'ına göre filtre — /etiket/[slug] sayfası için. */
  @IsString()
  @IsOptional()
  tagSlug?: string;

  @IsBooleanString()
  @IsOptional()
  featured?: string;

  /** Filter by the user who created the article (audit filter). */
  @IsString()
  @IsOptional()
  createdById?: string;

  @IsString()
  @IsOptional()
  sort?: string = 'latest';
}
