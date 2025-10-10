import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Post()
  assignRole(@Body() dto: CreateUserRoleDto) {
    return this.userRolesService.assignRole(dto);
  }

  @Get(':user_id')
  getUserRoles(@Param('user_id') user_id: string) {
    return this.userRolesService.getUserRoles(user_id);
  }

  @Delete(':user_id/:role_id')
  removeRole(
    @Param('user_id') user_id: string,
    @Param('role_id') role_id: number,
  ) {
    return this.userRolesService.removeRole(user_id, role_id);
  }
}
