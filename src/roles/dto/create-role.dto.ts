import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsObject()
  permissions?: Record<string, any>;
}
