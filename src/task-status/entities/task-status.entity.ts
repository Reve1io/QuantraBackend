import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('task_statuses')
export class TaskStatus {
  @PrimaryGeneratedColumn()
  status_id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 7, default: '#DDDDDD' })
  color: string;

  @Column({ type: 'boolean', default: false })
  is_default: boolean;

  @Column({ type: 'integer', nullable: false })
  position: number;
}
