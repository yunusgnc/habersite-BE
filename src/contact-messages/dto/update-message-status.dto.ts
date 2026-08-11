import { MessageStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMessageStatusDto {
  @IsEnum(MessageStatus)
  status: MessageStatus;

  /// Editörün dahili notu — okuyucuya gösterilmez.
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  adminNote?: string;
}
