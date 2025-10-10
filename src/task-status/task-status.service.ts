import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskStatus } from './entities/task-status.entity';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TaskStatusService {
  constructor(
    @InjectRepository(TaskStatus)
    private readonly statusRepo: Repository<TaskStatus>,
  ) {}

  async create(dto: CreateTaskStatusDto): Promise<TaskStatus> {
    const status = this.statusRepo.create(dto);
    return this.statusRepo.save(status);
  }

  async findAll(): Promise<TaskStatus[]> {
    return this.statusRepo.find({ order: { position: 'ASC' } });
  }

  async findOne(id: number): Promise<TaskStatus> {
    const status = await this.statusRepo.findOne({ where: { status_id: id } });
    if (!status) throw new NotFoundException(`Status #${id} not found`);
    return status;
  }

  async update(id: number, dto: UpdateTaskStatusDto): Promise<TaskStatus> {
    const status = await this.findOne(id);
    Object.assign(status, dto);
    return this.statusRepo.save(status);
  }

  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepo.remove(status);
  }
}
