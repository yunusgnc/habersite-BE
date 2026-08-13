import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRssSourceDto {
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsUrl({ require_protocol: true })
  url: string;

  @IsString()
  @IsOptional()
  defaultCategoryId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  defaultAuthorName?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsInt()
  @IsOptional()
  @Min(5)
  @Max(1440)
  fetchIntervalMinutes?: number;
}

export class UpdateRssSourceDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsUrl({ require_protocol: true })
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  defaultCategoryId?: string | null;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  defaultAuthorName?: string | null;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsInt()
  @IsOptional()
  @Min(5)
  @Max(1440)
  fetchIntervalMinutes?: number;
}
