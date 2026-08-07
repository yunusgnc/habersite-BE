import { IsArray, IsEnum, IsString } from 'class-validator';
import { ArticleStatus } from '@prisma/client';

export class BulkArticleDto {
  @IsArray()
  @IsString({ each: true })
  ids: string[];

  @IsEnum(ArticleStatus)
  status: ArticleStatus;
}
