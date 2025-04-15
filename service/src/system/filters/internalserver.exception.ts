import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP');
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    this.logger.error(exception?.stack?.toString());

    response.status(status).json({
      statusCode: status,
      message: 'Internal Server Error',
      error: 'Sorry we are experiencing technical problems',
    });
  }
}
