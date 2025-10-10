import {
  IsUUID,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  project_id: string;

  @IsOptional()
  @IsUUID()
  status_id?: string;

  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'critical'])
  priority?: 'low' | 'medium' | 'high' | 'critical';

  @IsOptional()
  @IsDateString()
  due_date?: string;

  @IsOptional()
  @IsString()
  estimated_time?: string;

  @IsOptional()
  @IsString()
  actual_time?: string;

  @IsUUID()
  createdBy: string;

  @IsOptional()
  @IsUUID()
  assignedTo?: string;
}
