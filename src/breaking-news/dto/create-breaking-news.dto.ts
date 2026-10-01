import {
  IsString,
  IsOptional,
  IsInt,
  IsDateString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBreakingNewsDto {
  @IsString()
  title: string;

  // URL hem tam adres (https://...) hem de site içi göreli yol (/haber/slug)
  // olabilir. "Haberlerden Ekle" modalı göreli /haber/slug üretiyor; eski
  // kayıtlar da göreli. @IsUrl() göreli yolu reddettiği için desen kullanılır.
  @Matches(/^(https?:\/\/\S+|\/\S*)$/, {
    message: 'url tam bir adres (https://...) veya / ile başlayan yol olmalı',
  })
  @IsOptional()
  url?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
