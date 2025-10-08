import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Проверка работоспособности API' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Business Process Control API',
      version: '1.0'
    };
  }
}