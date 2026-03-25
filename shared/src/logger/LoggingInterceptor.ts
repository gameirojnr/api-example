import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError } from 'rxjs';
import { Request } from 'express';
import { LoggerService } from './LoggerService';
import { RequestContextService } from './RequestContextService';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;
    const correlationId = RequestContextService.getCorrelationId();

    this.logger.log(`Incoming Request: ${method} ${originalUrl}`, {
      useCase: 'LoggingInterceptor',
      correlationId,
      method,
      url: originalUrl,
      userAgent,
      ip,
    });

    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - startTime;

        this.logger.log(
          `Outgoing Response: ${method} ${originalUrl} - Status: ${response.statusCode} - Duration: ${duration}ms`,
          {
            useCase: 'LoggingInterceptor',
            correlationId,
            method,
            url: originalUrl,
            statusCode: response.statusCode,
            durationMs: duration,
          },
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;

        this.logger.error(
          `Failed Request: ${method} ${originalUrl} - Status: ${error?.status || 500} - Duration: ${duration}ms`,
          error?.stack,
          {
            useCase: 'LoggingInterceptor',
            correlationId,
            method,
            url: originalUrl,
            statusCode: error?.status || error?.statusCode || 500,
            durationMs: duration,
            error: error?.message,
          },
        );

        throw error;
      }),
    );
  }
}
