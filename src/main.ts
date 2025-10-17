import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.enableCors();

  // Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // Глобальные интерсепторы
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new TransformInterceptor()
  );
  // test comment
  // CORS для Postman и React
  app.enableCors({
    origin: [
      'http://localhost:3000', // React
      'https://www.postman.com', // Postman web
      '*', // Для Desktop Postma
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  // Swagger документация
  const config = new DocumentBuilder()
    .setTitle('Business Process Control API')
    .setDescription('API для системы контроля бизнес-процессов')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
// Handle the promise properly
bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
