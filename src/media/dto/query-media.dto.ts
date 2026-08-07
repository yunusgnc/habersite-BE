import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MediaType } from '@prisma/client';

export class QueryMediaDto {
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
}
