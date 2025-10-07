import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

// Тип для пользователя без password_hash
export type UserWithoutPassword = Omit<User, 'password_hash'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // Вспомогательный метод для добавления full_name
  private addFullName(user: User): UserWithoutPassword {
    const { password_hash, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      full_name: user.getFullName()
    };
  }

  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    // Проверка на существующего пользователя по email
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUserByEmail) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Проверка на существующего пользователя по телефону
    const existingUserByPhone = await this.usersRepository.findOne({
      where: { phone: createUserDto.phone }
    });

    if (existingUserByPhone) {
      throw new ConflictException('Пользователь с таким телефоном уже существует');
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password_hash: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);
    return this.addFullName(savedUser);
  }

  async findAll(): Promise<UserWithoutPassword[]> {
    const users = await this.usersRepository.find({
      select: [
        'user_id', 'email', 'phone', 'first_name', 'last_name',
        'avatar_url', 'is_active', 'last_login', 'created_at', 'updated_at'
      ]
    });

    return users.map(user => this.addFullName(user));
  }

  async findOne(user_id: string): Promise<UserWithoutPassword> {
    const user = await this.usersRepository.findOne({
      where: { user_id },
      select: [
        'user_id', 'email', 'phone', 'first_name', 'last_name',
        'avatar_url', 'is_active', 'last_login', 'created_at', 'updated_at'
      ]
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${user_id} не найден`);
    }

    return this.addFullName(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { email },
      select: ['user_id', 'email', 'phone', 'password_hash', 'first_name', 'last_name', 'is_active']
    });
  }

  async findByPhone(phone: number): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: { phone },
      select: ['user_id', 'email', 'phone', 'password_hash', 'first_name', 'last_name', 'is_active']
    });
  }

  async update(user_id: string, updateUserDto: UpdateUserDto): Promise<UserWithoutPassword> {
    const user = await this.usersRepository.findOne({ where: { user_id } });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${user_id} не найден`);
    }

    // Проверка уникальности email
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    // Проверка уникальности телефона
    if (updateUserDto.phone && updateUserDto.phone !== user.phone) {
      const existingUser = await this.findByPhone(updateUserDto.phone);
      if (existingUser) {
        throw new ConflictException('Пользователь с таким телефоном уже существует');
      }
    }

    // Хэширование пароля если он обновляется
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      (updateUserDto as any).password_hash = hashedPassword;
      delete updateUserDto.password;
    }

    await this.usersRepository.update(user_id, updateUserDto);
    const updatedUser = await this.usersRepository.findOne({
      where: { user_id },
      select: [
        'user_id', 'email', 'phone', 'first_name', 'last_name',
        'avatar_url', 'is_active', 'last_login', 'created_at', 'updated_at'
      ]
    });

    return this.addFullName(updatedUser);
  }

  async remove(user_id: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { user_id } });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${user_id} не найден`);
    }

    await this.usersRepository.remove(user);
  }

  async updateLastLogin(user_id: string): Promise<void> {
    await this.usersRepository.update(user_id, { last_login: new Date() });
  }

  async deactivateUser(user_id: string): Promise<UserWithoutPassword> {
    await this.usersRepository.update(user_id, { is_active: false });
    return await this.findOne(user_id);
  }

  async activateUser(user_id: string): Promise<UserWithoutPassword> {
    await this.usersRepository.update(user_id, { is_active: true });
    return await this.findOne(user_id);
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}