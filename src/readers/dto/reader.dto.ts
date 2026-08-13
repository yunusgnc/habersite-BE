import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterReaderDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;
}

export class LoginReaderDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  password: string;
}

export class UpdateReaderDto {
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(120)
  name?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(120)
  password?: string;
}
