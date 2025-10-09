// src/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  passwordHash: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  lastLogin?: Date;
}
