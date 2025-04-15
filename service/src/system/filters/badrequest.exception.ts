import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  Logger,
  ValidationError,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');
  private errorResponse: Record<string, unknown>;
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const message = (<any>exception.getResponse()).message;

    if (Array.isArray(message) && message.length > 0) {
      const errors = message.map((error: ValidationError) => {
        return {
          param: error.property,
          value: error.value,
          msg: error.constraints
            ? Object.values(error.constraints)[0]
            : message,
        };
      });

      this.errorResponse = {
        code: status,
        message: 'Bad Request',
        timestamp: new Date().toISOString(),
        errors,
      };

      this.logger.warn(JSON.stringify(this.errorResponse));
      return response.status(status).json(this.errorResponse);
    }

    this.errorResponse = {
      code: status,
      message: 'Bad Request',
      timestamp: new Date().toISOString(),
      errors: [message],
    };

    this.logger.warn(JSON.stringify(this.errorResponse));

    response.status(status).json(this.errorResponse);
  }
}
