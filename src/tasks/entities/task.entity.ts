import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Project } from 'src/projects/entities/project.entity';
import { TaskStatus } from 'src/task-status/entities/task-status.entity';
import { TaskComment} from '../../task-comments/entities/task-comment.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  task_id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project?: Project | null;

  @ManyToOne(() => TaskStatus, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'status_id' })
  status?: TaskStatus | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @Column({ type: 'timestamptz', nullable: true })
  due_date?: Date | null;

  @Column({ type: 'interval', nullable: true })
  estimated_time?: string | null;

  @Column({ type: 'interval', nullable: true })
  actual_time?: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'created_by' })
  createdBy?: User | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'assigned_to' })
  assignedTo?: User | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @OneToMany(() => TaskComment, (comment) => comment.task)
  comments: TaskComment[];
}

