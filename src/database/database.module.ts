import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import 'dotenv/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        /*
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'Romanov-9653.'),
        database: configService.get('DB_NAME', 'Quantra'), */
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('DB_SYNCHRONIZE', false), // false для production
        logging: configService.get('DB_LOGGING', true),
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, // ⚠️ Нужно для Supabase
            require: true
          }
        }
      })
    })
  ]
})
export class DatabaseModule {}
