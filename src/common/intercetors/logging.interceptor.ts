import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('LoggingInterceptor');
  constructor(private readonly config: ConfigService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const { ip, path, body, params, query } = req;
    const now = Date.now();

    const ipMsg = `\nip: ${ip}`;
    const pathMsg = `\npath: ${path}`;
    const bodyMsg = `\nbody: ${JSON.stringify(body, null, 2)}`;
    const paramsMsg = `\nparams: ${JSON.stringify(params, null, 2)}`;
    const queryMsg = `\nquery: ${JSON.stringify(query, null, 2)}`;
    const message = `${ipMsg}${pathMsg}${bodyMsg}${paramsMsg}${queryMsg}`;

    return next
      .handle()
      .pipe(
        tap(
          () =>
            this.config.get<string>('NODE_ENV') !== 'test' &&
            this.logger.log(message),
        ),
      );
  }
}
