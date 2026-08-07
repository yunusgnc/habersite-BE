import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateBreakingNewsDto } from './create-breaking-news.dto';

export class UpdateBreakingNewsDto extends PartialType(CreateBreakingNewsDto) {
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
