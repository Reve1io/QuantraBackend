import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, any>;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
