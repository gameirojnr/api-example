import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseDomainError } from '@api/domain/shared/BaseDomainError';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BaseDomainError) {
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

      response.status(status).json(
        typeof exceptionResponse === 'string'
          ? { statusCode: status, message: exceptionResponse }
          : exceptionResponse,
      );
      return;
    }

    response.status(500).json({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  }
}
