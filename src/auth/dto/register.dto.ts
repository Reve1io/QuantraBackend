import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  phone: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  avatarUrl?: string;
}
