import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './entities/user-role.entity';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UserRolesService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepo: Repository<UserRole>,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async assignRole(dto: CreateUserRoleDto): Promise<UserRole> {
    const user = await this.usersService.findById(dto.user_id);
    const role = await this.rolesService.findById(dto.role_id);

    if (!user) throw new NotFoundException('User not found');
    if (!role) throw new NotFoundException('Role not found');

    const userRole = this.userRoleRepo.create(dto);
    return this.userRoleRepo.save(userRole);
  }

  async getUserRoles(user_id: string): Promise<UserRole[]> {
    return this.userRoleRepo.find({
      where: { user_id },
      relations: ['role'],
    });
  }

  async removeRole(user_id: string, role_id: number): Promise<void> {
    await this.userRoleRepo.delete({ user_id, role_id });
  }
}
