import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './AppModule';
import { LoggerService, LoggingInterceptor } from '@api-example/shared';
import { GlobalExceptionFilter } from './infrastructure/filters/GlobalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = await app.resolve(LoggerService);

  app.useLogger(logger);

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
