import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleStatus } from '@prisma/client';

export class CreateGalleryImageDto {
  @IsString()
  url: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  credit?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}

export class CreateGalleryDto {
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

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGalleryImageDto)
  @IsOptional()
  images?: CreateGalleryImageDto[];

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
