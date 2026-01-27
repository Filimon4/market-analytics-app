import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class ExceptionsLogger implements ExceptionFilter {
    private readonly logger = new Logger(ExceptionsLogger.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
  
      const isHttpException = exception instanceof HttpException;
  
      const status = isHttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      const errorResponse = isHttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };
  
      const message =
        typeof errorResponse === 'string'
          ? errorResponse
          : (errorResponse as any).message;
  
      this.logger.error(
        {
          method: request.method,
          url: request.url,
          statusCode: status,
          message,
          stack: exception instanceof Error ? exception.stack : undefined,
        }
      );
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
      });
    }
  }
  