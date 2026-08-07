import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBooleanString,
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
