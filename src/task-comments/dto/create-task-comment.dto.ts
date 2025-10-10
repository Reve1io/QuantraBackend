// src/task-comments/dto/create-task-comment.dto.ts
import { IsUUID, IsString, Length } from 'class-validator';

export class CreateTaskCommentDto {
  @IsUUID()
  task_id: string;

  @IsString()
  @Length(1, 2000)
  content: string;
}
