import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TaskStatusService } from './task-status.service';
import { CreateTaskStatusDto } from './dto/create-task-status.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Controller('task-status')
export class TaskStatusController {
  constructor(private readonly taskStatusService: TaskStatusService) {}

  @Post()
  create(@Body() dto: CreateTaskStatusDto) {
    return this.taskStatusService.create(dto);
  }

  @Get()
  findAll() {
    return this.taskStatusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.taskStatusService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateTaskStatusDto) {
    return this.taskStatusService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.taskStatusService.remove(+id);
  }
}
