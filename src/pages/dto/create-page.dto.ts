import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDefined,
  MinLength,
} from 'class-validator';

export class CreatePageDto {
  @IsString()
  @MinLength(2)
  title: string;

  /**
   * URL slug. If omitted, the service auto-generates one from `title`.
   */
  @IsString()
  @IsOptional()
  slug?: string;

  /**
   * Rich content. Accepts a Tiptap HTML string OR a structured JSON object —
   * the service stores whatever it receives in a `content` Json column.
   */
  @IsDefined()
  content: string | Record<string, any>;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDesc?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdatePageDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  title?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsOptional()
  content?: string | Record<string, any>;

  @IsString()
  @IsOptional()
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDesc?: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
