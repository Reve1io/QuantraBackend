import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @ApiProperty({ description: 'Уникальный идентификатор пользователя' })
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @ApiProperty({ description: 'Email пользователя', example: 'user@example.com' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Телефон пользователя', example: 79991234567 })
  @Column({ type: 'numeric', precision: 20, scale: 0 })
  phone: number;

  @ApiProperty({ description: 'Хэш пароля' })
  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  @Exclude()
  password_hash: string;

  @ApiProperty({ description: 'Имя пользователя', example: 'Иван' })
  @Column({ type: 'varchar', length: 100, name: 'first_name', nullable: true })
  first_name: string;

  @ApiProperty({ description: 'Фамилия пользователя', example: 'Петров' })
  @Column({ type: 'varchar', length: 100, name: 'last_name', nullable: true })
  last_name: string;

  @ApiProperty({ description: 'Полное имя пользователя', example: 'Иван Петров' })
  full_name: string;

  @ApiProperty({ description: 'URL аватара', example: 'https://example.com/avatar.jpg', nullable: true })
  @Column({ type: 'varchar', length: 255, name: 'avatar_url', nullable: true })
  avatar_url: string;

  @ApiProperty({ description: 'Активен ли пользователь', example: true })
  @Column({ type: 'boolean', default: true, name: 'is_active' })
  is_active: boolean;

  @ApiProperty({ description: 'Дата последнего входа', nullable: true })
  @Column({ type: 'timestamp with time zone', name: 'last_login', nullable: true })
  last_login: Date;

  @ApiProperty({ description: 'Дата создания' })
  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  created_at: Date;

  @ApiProperty({ description: 'Дата обновления' })
  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updated_at: Date;

  // Метод для вычисления full_name
  getFullName(): string {
    return `${this.first_name || ''} ${this.last_name || ''}`.trim();
  }
}