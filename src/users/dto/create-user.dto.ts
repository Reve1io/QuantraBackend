import {
  IsEmail,
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  MinLength,
  IsUrl,
  IsPositive
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 79991234567 })
  @IsNumber()
  @IsPositive()
  phone: number;

  @ApiProperty({ example: 'Иван' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  first_name?: string;

  @ApiProperty({ example: 'Петров' })
  @IsString()
  @MinLength(2)
  @IsOptional()
  last_name?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsUrl()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
