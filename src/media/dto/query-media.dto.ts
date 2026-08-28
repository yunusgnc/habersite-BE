import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class QueryMediaDto {
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
  @Max(100)
  @IsOptional()
  limit?: number = 30;

  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  /** Dosya adı, başlık, alt metin veya adreste arar. */
  @IsString()
  @IsOptional()
  search?: string;
}
