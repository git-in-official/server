import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { LoggingInterceptor } from './logging.interceptor';

const interceptors = [
  { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
];

@Module({
  providers: [...interceptors],
})
export class InterceptorsModule {}
