import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('task_statuses')
export class TaskStatus {
  @PrimaryGeneratedColumn()
  status_id: number;

  @Column()
  name: string;
}
