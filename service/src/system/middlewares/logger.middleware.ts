import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
class LoggerRequestMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP')

  use(request: Request & { auth: unknown }, response: Response, next: NextFunction) {
    const requestStart = Date.now()

    response.on('finish', () => {
      const { method, originalUrl } = request
      const { statusCode, statusMessage } = response
      const processingTime = Date.now() - requestStart
      const message = `${method} ${originalUrl} ${statusCode} ${statusMessage} ${processingTime}ms`

      if (statusCode >= 500) {
        return this.logger.error(message)
      }

      if (statusCode >= 400) {
        return this.logger.warn(message)
      }

      return this.logger.log(message)
    })

    next()
  }
}

export default LoggerRequestMiddleware
