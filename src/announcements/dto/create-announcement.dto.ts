import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;

  @IsBoolean()
  @IsOptional()
  pinned?: boolean;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;
}
