import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/user.entity';
import { TaskStatus } from 'src/task-status/entities/task-status.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(TaskStatus) private readonly statusRepo: Repository<TaskStatus>,
  ) {}

  async create(dto: CreateTaskDto): Promise<Task> {

    const createdBy = await this.userRepo.findOne({ where: { user_id: dto.createdBy } });
    if (!createdBy) throw new NotFoundException('Creator not found');

    const project = await this.projectRepo.findOne({ where: { project_id: dto.project_id } });
    if (!project) throw new NotFoundException('Project not found');

    const assignee = dto.assignedTo
      ? await this.userRepo.findOne({ where: { user_id: dto.assignedTo } })
      : null;

    const status = dto.status_id
      ? await this.statusRepo.findOne({ where: { status_id: +dto.status_id } })
      : null;

    const task = this.taskRepo.create({
      title: dto.title,
      description: dto.description,
      project: project,
      priority: dto.priority,
      due_date: dto.due_date ? new Date(dto.due_date) : null,
      estimated_time: dto.estimated_time,
      actual_time: dto.actual_time,
      createdBy: createdBy,
      assignedTo: assignee,
      status,
    });

    return this.taskRepo.save(task);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepo.find({
      relations: ['project', 'createdBy', 'assignedTo', 'status'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { task_id: id },
      relations: ['project', 'createdBy', 'assignedTo', 'status'],
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (dto.project_id) {
      const project = await this.projectRepo.findOne({ where: { project_id: dto.project_id } });
      task.project = project;
    }

    if (dto.assignedTo) {
      const assignee = await this.userRepo.findOne({ where: { user_id: dto.assignedTo } });
      task.assignedTo = assignee;
    }

    if (dto.status_id) {
      const status = await this.statusRepo.findOne({ where: { status_id: +dto.status_id } });
      task.status = status;
    }

    Object.assign(task, dto);

    return this.taskRepo.save(task);
  }

  async remove(id: string): Promise<void> {
    const result = await this.taskRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Task not found');
  }
}
