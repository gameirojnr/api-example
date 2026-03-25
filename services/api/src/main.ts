import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppModule } from './AppModule';
import { LoggerService, LoggingInterceptor } from '@shared';
import { GlobalExceptionFilter } from '@shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = await app.resolve(LoggerService);

  app.useLogger(logger);

  app.use('/.well-known', (_req: Request, res: Response) => res.status(404).end());

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`, 'Bootstrap');
}

bootstrap();
