// src/task-comments/task-comments.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskComment } from './entities/task-comment.entity';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';

@Injectable()
export class TaskCommentsService {
  constructor(
    @InjectRepository(TaskComment)
    private readonly commentRepo: Repository<TaskComment>,
  ) {}

  async create(userId: string, dto: CreateTaskCommentDto) {
    const comment = this.commentRepo.create({
      task: { task_id: dto.task_id } as any,
      user: { user_id: userId } as any,
      content: dto.content,
    });
    return this.commentRepo.save(comment);
  }

  async findAllByTask(taskId: string) {
    return this.commentRepo.find({
      where: { task: { task_id: taskId } },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }

  async update(commentId: string, dto: UpdateTaskCommentDto) {
    const comment = await this.commentRepo.findOneBy({ comment_id: commentId });
    if (!comment) throw new NotFoundException('Comment not found');
    comment.content = dto.content;
    return this.commentRepo.save(comment);
  }

  async remove(commentId: string) {
    const comment = await this.commentRepo.findOneBy({ comment_id: commentId });
    if (!comment) throw new NotFoundException('Comment not found');
    return this.commentRepo.remove(comment);
  }
}
