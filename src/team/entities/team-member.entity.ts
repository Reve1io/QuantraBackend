import {
  Entity,
  Column,
  ManyToOne,
  PrimaryColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';
import { User } from '../../users/user.entity';

@Entity('team_members')
export class TeamMember {
  @PrimaryColumn('uuid')
  team_id: string;

  @PrimaryColumn('uuid')
  user_id: string;

  @ManyToOne(() => Team, (team) => team.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 50, default: 'member' })
  role: string;

  @CreateDateColumn({ type: 'timestamptz' })
  joined_at: Date;
}
