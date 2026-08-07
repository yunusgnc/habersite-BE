import { IsString, IsOptional } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsString()
  @IsOptional()
  credit?: string;
}
