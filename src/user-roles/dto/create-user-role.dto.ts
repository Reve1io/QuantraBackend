import { IsUUID, IsInt } from 'class-validator';

export class CreateUserRoleDto {
  @IsUUID()
  user_id: string;

  @IsInt()
  role_id: number;
}