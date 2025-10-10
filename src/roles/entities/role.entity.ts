import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { UserRole } from '../../user-roles/entities/user-role.entity';

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

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
