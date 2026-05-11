import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const now = Date.now();

    this.logger.log(`${request?.method} ${request?.originalUrl}`);

    if (request.body && Object.keys(request.body as Record<string, unknown>).length) {
      this.logger.log(`${request?.method} ${request?.originalUrl} ${JSON.stringify(request.body)}`);
    }

    return next.handle().pipe(
      tap((data: unknown) => {
        const delay = Date.now() - now;

        this.logger.log(`${request?.method} ${request?.originalUrl} ${response?.statusCode} ${JSON.stringify(data)}`);
        this.logger.log(`${request?.method} ${request?.originalUrl} ${response?.statusCode} (${delay} ms)`);
      }),
      catchError((exception: Error) => {
        const statusCode =
          exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          exception instanceof HttpException ? JSON.stringify(exception.getResponse()) : exception.message;
        const delay = Date.now() - now;

        this.logger.error(`${request?.method} ${request?.originalUrl} ${statusCode} ${message}`);
        this.logger.error(`${request?.method} ${request?.originalUrl} ${statusCode} (${delay} ms)`);

        return throwError(() => exception);
      }),
    );
  }
}
