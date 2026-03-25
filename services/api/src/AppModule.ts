import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppConfigModule } from './config/AppConfigModule';
import { BookModule } from './infrastructure/book/BookModule';
import { LoggerModule, CorrelationIdMiddleware } from '@api-example/shared';
import { AppController } from './AppController';

@Module({
  imports: [AppConfigModule, LoggerModule, BookModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
