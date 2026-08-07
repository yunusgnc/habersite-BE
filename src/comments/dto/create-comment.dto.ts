import {
  IsString,
  IsOptional,
  IsEmail,
  MinLength,
} from 'class-validator';

export class CreateCommentDto {
  @IsString()
  articleId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  content: string;

  @IsString()
  @IsOptional()
  parentId?: string;
}
