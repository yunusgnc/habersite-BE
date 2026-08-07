import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleStatus } from '@prisma/client';

export class CreateVideoDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  // Either videoUrl (uploaded file path OR youtube URL) OR embedCode is required.
  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsOptional()
  embedCode?: string;

  @IsString()
  @IsOptional()
  source?: string = 'upload';

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  duration?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  fileSize?: number;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  status?: ArticleStatus;

  @IsString()
  @IsOptional()
  publishedAt?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDesc?: string;

  @IsString()
  @IsOptional()
  seoKeywords?: string;
}
