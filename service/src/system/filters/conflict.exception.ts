import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(ConflictException)
export class ConflictExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');
  private errorResponse: Record<string, unknown>;
  catch(exception: ConflictException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = (<any>exception.getResponse()).message;

    this.errorResponse = {
      statusCode: status,
      message: message,
      error: 'Conflict',
    };

    this.logger.warn(JSON.stringify(this.errorResponse));

    response.status(status).json(this.errorResponse);
  }
}
