import { NoticeType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class NoticeAttachmentDto {
  @IsString()
  @MaxLength(1000)
  url: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  name?: string;
}

export class CreateOfficialNoticeDto {
  @IsString()
  @MinLength(3)
  @MaxLength(300)
  title: string;

  /// Verilmezse başlıktan türetilir.
  @IsString()
  @IsOptional()
  @MaxLength(300)
  slug?: string;

  @IsEnum(NoticeType)
  @IsOptional()
  noticeType?: NoticeType;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  institution: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  referenceNo?: string;

  @IsString()
  @IsOptional()
  @MaxLength(600)
  summary?: string;

  @IsString()
  @MinLength(3)
  content: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => NoticeAttachmentDto)
  attachments?: NoticeAttachmentDto[];

  @IsDateString()
  @IsOptional()
  publishedAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string | null;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
