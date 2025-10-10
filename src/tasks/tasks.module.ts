import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Project } from 'src/projects/entities/project.entity';
import { User } from 'src/users/user.entity';
import { TaskStatus } from 'src/task-status/entities/task-status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project, User, TaskStatus])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
