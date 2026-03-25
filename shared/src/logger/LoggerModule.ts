import { Global, Module } from '@nestjs/common';
import { LoggerService } from './LoggerService';

@Global()
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
