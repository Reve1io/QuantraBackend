import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(({ level, message, timestamp, context }) => {
  return `${timestamp} [${level.toUpperCase()}]${context ? ' [' + context + ']' : ''} ${message}`;
});

export const winstonConfig: winston.LoggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    logFormat,
  ),
  transports: [
    // ✅ Ошибки
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '10m',
      maxFiles: '14d',
    }),

    // ✅ Все логи
    new winston.transports.DailyRotateFile({
      dirname: 'logs',
      filename: 'combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
      maxSize: '10m',
      maxFiles: '14d',
    }),

    // ✅ Для локальной отладки
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
};
