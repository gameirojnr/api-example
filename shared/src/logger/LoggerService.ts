import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';
import { RequestContextService } from './RequestContextService';

export interface LogContext {
  useCase?: string;
  [key: string]: unknown;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;
  private serviceName: string;

  constructor() {
    this.serviceName = process.env.SERVICE_NAME || 'unknown-service';
    const logLevel = process.env.LOG_LEVEL || 'info';
    const isProduction = process.env.NODE_ENV === 'production';

    const transports: winston.transport[] = [];

    if (isProduction) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      );
    } else {
      const devFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const correlationId = meta.correlationId || '-';
        const context = meta.useCase || meta.context || '';
        const remaining = { ...meta };
        delete remaining.correlationId;
        delete remaining.service;
        delete remaining.useCase;
        delete remaining.context;

        const metaStr =
          Object.keys(remaining).length > 0
            ? ` ${JSON.stringify(remaining)}`
            : '';

        return `${timestamp} [${level}] (${this.serviceName}) [${correlationId}]${context ? ` (${context})` : ''}: ${message}${metaStr}`;
      });

      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            devFormat,
          ),
        }),
        new winston.transports.File({
          filename: 'logs/app.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            devFormat,
          ),
        }),
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      defaultMeta: { service: this.serviceName },
      transports,
    });
  }

  private buildMeta(context?: LogContext | string): Record<string, unknown> {
    const correlationId = RequestContextService.getCorrelationId();
    const meta: Record<string, unknown> = {};

    if (correlationId) {
      meta.correlationId = correlationId;
    }

    if (typeof context === 'string') {
      meta.context = context;
    } else if (context) {
      Object.assign(meta, context);
    }

    return meta;
  }

  log(message: string, context?: LogContext | string): void {
    this.logger.info(message, this.buildMeta(context));
  }

  error(message: string, trace?: string, context?: LogContext | string): void {
    this.logger.error(message, { ...this.buildMeta(context), trace });
  }

  warn(message: string, context?: LogContext | string): void {
    this.logger.warn(message, this.buildMeta(context));
  }

  debug(message: string, context?: LogContext | string): void {
    this.logger.debug(message, this.buildMeta(context));
  }

  verbose(message: string, context?: LogContext | string): void {
    this.logger.verbose(message, this.buildMeta(context));
  }
}
