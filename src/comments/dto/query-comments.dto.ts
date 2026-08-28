import { IsString, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { CommentStatus } from '@prisma/client';

export class QueryCommentsDto {
  @IsString()
  @IsOptional()
  articleId?: string;

  @IsEnum(CommentStatus)
  @IsOptional()
  status?: CommentStatus;

  /** Numaralı sayfalama — verilirse imleç yok sayılır (bkz. sayfali-liste). */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  cursor?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  limit?: number = 20;
}
