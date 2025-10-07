import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан', type: User })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email или телефоном уже существует'
  })
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<Omit<User, 'password_hash'>> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User]
  })
  async findAll(): Promise<Omit<User, 'password_hash'>[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь найден', type: User })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Omit<User, 'password_hash'>> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь обновлен',
    type: User
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<Omit<User, 'password_hash'>> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({ status: 204, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Put(':id/deactivate')
  @ApiOperation({ summary: 'Деактивировать пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь деактивирован',
    type: User
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Omit<User, 'password_hash'>> {
    return await this.usersService.deactivateUser(id);
  }

  @Put(':id/activate')
  @ApiOperation({ summary: 'Активировать пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь активирован',
    type: User
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async activate(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Omit<User, 'password_hash'>> {
    return await this.usersService.activateUser(id);
  }
}
