import { IsUUID, IsString, IsOptional, IsIn, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  team_id?: string;

  @IsOptional()
  @IsIn(['planning', 'active', 'on_hold', 'completed', 'archived'])
  status?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  start_date?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value).toISOString())
  @IsDateString()
  end_date?: Date;

  @IsUUID()
  created_by: string;
}
