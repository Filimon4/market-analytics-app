import { DynamicModule, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {
  static forRoot(): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        LoggerService,
        LoggerInterceptor,
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggerInterceptor,
        },
      ],
      exports: [LoggerService],
    };
  }
}
