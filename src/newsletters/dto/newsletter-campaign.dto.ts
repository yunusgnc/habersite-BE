import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export enum NewsletterCampaignStatus {
  DRAFT = 'DRAFT',
  SCHEDULED = 'SCHEDULED',
  SENDING = 'SENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class CreateCampaignDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  subject: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  preheader?: string;

  /** HTML gövde — TipTap/wysiwyg çıkışı beklenir */
  @IsString()
  @MinLength(1)
  htmlBody: string;

  @IsString()
  @IsOptional()
  textBody?: string;

  /** DRAFT default; SCHEDULED için scheduledAt zorunlu */
  @IsEnum(NewsletterCampaignStatus)
  @IsOptional()
  status?: NewsletterCampaignStatus;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;
}

export class UpdateCampaignDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(200)
  subject?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  preheader?: string;

  @IsString()
  @IsOptional()
  htmlBody?: string;

  @IsString()
  @IsOptional()
  textBody?: string;

  @IsEnum(NewsletterCampaignStatus)
  @IsOptional()
  status?: NewsletterCampaignStatus;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string | null;
}

export class ListCampaignsQuery {
  @IsInt()
  @IsOptional()
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Min(1)
  perPage?: number;

  @IsEnum(NewsletterCampaignStatus)
  @IsOptional()
  status?: NewsletterCampaignStatus;
}
