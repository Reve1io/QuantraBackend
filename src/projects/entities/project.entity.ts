import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Team } from '../../team/entities/team.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  project_id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Team, (team) => team.projects, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'active',
  })
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';

  @Column({ type: 'date', nullable: true })
  start_date?: Date;

  @Column({ type: 'date', nullable: true })
  end_date?: Date;

  @ManyToOne(() => User, (user) => user.createdProjects)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // 👇 Добавь это поле для связи с задачами
  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];
}
