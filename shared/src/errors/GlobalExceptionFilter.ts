import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseDomainError } from './BaseDomainError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@Inject('LoggerService') private readonly logger: any) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const logContext = {
      useCase: 'GlobalExceptionFilter',
      path: request?.url,
      method: request?.method,
    };

    if (exception instanceof BaseDomainError) {
      this.logger.warn(
        `Domain Error: ${exception.name} — ${exception.message}`,
        {
          ...logContext,
          error: exception.name,
          stack: exception.stack,
        },
      );

      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        error: exception.name,
        message: exception.message,
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      this.logger.warn(`HTTP Exception: ${exception.message}`, {
        ...logContext,
        statusCode: status,
        stack: exception.stack,
      });

      response.status(status).json(
        typeof exceptionResponse === 'string'
          ? { statusCode: status, message: exceptionResponse }
          : exceptionResponse,
      );
      return;
    }

    const error =
      exception instanceof Error ? exception : new Error(String(exception));

    this.logger.error(
      `Unhandled Exception: ${error.message}`,
      error.stack,
      logContext,
    );

    response.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}
