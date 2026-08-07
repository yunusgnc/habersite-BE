import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArticleStatus } from '@prisma/client';

export class UpdateVideoDto {
  @IsString()
  @IsOptional()
  title?: string;

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
  videoUrl?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  duration?: number;

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
}
