import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { TeamMember } from './entities/team-member.entity';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,

    private readonly usersService: UsersService, // ✅ добавляем зависимость

    @InjectRepository(TeamMember)
    private readonly memberRepo: Repository<TeamMember>,
  ) {}

  async create(dto: CreateTeamDto): Promise<Team> {
    const creator = await this.usersService.findOne(dto.created_by);
    if (!creator) throw new NotFoundException('User not found');

    const team = this.teamRepo.create({
      name: dto.name,
      description: dto.description,
      created_by: creator,
    });

    return this.teamRepo.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepo.find({ relations: ['members', 'created_by'] });
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamRepo.findOne({
      where: { team_id: id },
      relations: ['members', 'created_by'],
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, dto: UpdateTeamDto): Promise<Team> {
    const team = await this.findOne(id);
    Object.assign(team, dto);
    return this.teamRepo.save(team);
  }

  async remove(id: string): Promise<void> {
    const team = await this.findOne(id);
    await this.teamRepo.remove(team);
  }

  async addMember(team_id: string, user_id: string, role = 'member'): Promise<TeamMember> {
    const member = this.memberRepo.create({ team_id, user_id, role });
    return this.memberRepo.save(member);
  }

  async removeMember(team_id: string, user_id: string): Promise<void> {
    await this.memberRepo.delete({ team_id, user_id });
  }
}
