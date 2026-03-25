import { Module } from '@nestjs/common';
import { AppConfigModule } from './config/AppConfigModule';
import { BookModule } from './infrastructure/book/BookModule';

@Module({
  imports: [AppConfigModule, BookModule],
})
export class AppModule {}
