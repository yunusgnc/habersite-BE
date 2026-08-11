import { MessageType } from '@prisma/client';
import {
  ArrayMaxSize,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactMessageDto {
  /// CONTACT (varsayılan) | TIP (ihbar) | REMOVAL_REQUEST (KVKK)
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @MaxLength(40)
  phone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  subject?: string;

  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  message: string;

  /// KVKK talebi: kaldırılması istenen içeriğin adresi.
  @IsUrl({ require_protocol: true })
  @IsOptional()
  @MaxLength(500)
  targetUrl?: string;

  /// İhbar: olayın geçtiği ilçe / mahalle.
  @IsString()
  @IsOptional()
  @MaxLength(120)
  district?: string;

  /// İhbar: yüklenen foto/video URL'leri.
  @IsArray()
  @IsOptional()
  @ArrayMaxSize(6)
  @IsString({ each: true })
  attachments?: string[];
}
