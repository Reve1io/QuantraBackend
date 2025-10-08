// src/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create(dto as unknown as User);
    return this.userRepo.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const res = await this.userRepo.delete({ user_id: id });
    if (res.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
