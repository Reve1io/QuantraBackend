// src/task-comments/task-comments.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { TaskCommentsService } from './task-comments.service';
import { CreateTaskCommentDto } from './dto/create-task-comment.dto';
import { UpdateTaskCommentDto } from './dto/update-task-comment.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';

@Controller('tasks/:taskId/comments')
export class TaskCommentsController {
  constructor(private readonly commentsService: TaskCommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Param('taskId') taskId: string,
    @Body() dto: CreateTaskCommentDto,
    @Req() req,
  ) {
    return this.commentsService.create(req.user.user_id, { ...dto, task_id: taskId });
  }

  @Get()
  findAll(@Param('taskId') taskId: string) {
    return this.commentsService.findAllByTask(taskId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':commentId')
  update(@Param('commentId') id: string, @Body() dto: UpdateTaskCommentDto) {
    return this.commentsService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  remove(@Param('commentId') id: string) {
    return this.commentsService.remove(id);
  }
}
