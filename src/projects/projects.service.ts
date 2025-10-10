import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { User } from '../users/user.entity';
import { Team } from '../team/entities/team.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Team)
    private readonly teamRepo: Repository<Team>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const user = await this.userRepo.findOne({
      where: { user_id: dto.created_by },
    });
    if (!user) throw new NotFoundException('User not found');

    let team: Team | null = null;
    if (dto.team_id) {
      team = await this.teamRepo.findOne({ where: { team_id: dto.team_id } });
      if (!team) throw new NotFoundException('Team not found');
    }

    const project = this.projectRepo.create({
      name: dto.name,
      description: dto.description,
      status: dto.status || 'active',
      start_date: dto.start_date,
      end_date: dto.end_date,
      created_by: user,
      team,
    } as Partial<Project>);

    return await this.projectRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find({ relations: ['created_by', 'team'] });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepo.findOne({
      where: { project_id: id },
      relations: ['created_by', 'team'],
    });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(id: string, dto: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(id);

    if (dto.team_id) {
      const team = await this.teamRepo.findOne({ where: { team_id: dto.team_id } });
      if (!team) throw new NotFoundException('Team not found');
      project.team = team;
    }

    Object.assign(project, dto);
    return await this.projectRepo.save(project);
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepo.remove(project);
  }
}
