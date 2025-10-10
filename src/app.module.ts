import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { RolesModule } from './roles/roles.module';
import { TeamModule } from './team/team.module';
import { UserRolesModule } from './user-roles/user-roles.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TaskStatusModule } from './task-status/task-status.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    ConfigModule.forRoot({isGlobal: true}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    RolesModule,
    TeamModule,
    UserRolesModule,
    ProjectsModule,
    TasksModule,
    TaskStatusModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
