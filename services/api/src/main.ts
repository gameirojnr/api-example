import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
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

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('Book API with clean architecture')
    .setVersion('0.1.0')
    .addTag('Books', 'Query books by ID or ISBN')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use('/openapi.json', (_req: Request, res: Response) => res.json(document));

  app.use(
    '/docs',
    apiReference({
      spec: { content: document },
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: { targetKey: 'shell', clientKey: 'curl' },
      metaData: { title: 'API Example Reference' },
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`, 'Bootstrap');
}

bootstrap();
