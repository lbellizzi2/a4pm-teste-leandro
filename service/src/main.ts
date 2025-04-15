import * as dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import {
  BadRequestException,
  RequestMethod,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import helmet from 'helmet';
import compression from 'compression';
import { BadRequestExceptionFilter } from './system/filters/badrequest.exception';
import { ConflictExceptionFilter } from './system/filters/conflict.exception';
import { InternalServerExceptionFilter } from './system/filters/internalserver.exception';
import { NotFoundExceptionFilter } from './system/filters/notfound.exception';
import { TransformInterceptor } from './system/interceptors/transform.interceptor';

dotenv.config();

async function bootstrap() {
  const port = process.env.PORT || 3000;

  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(bodyParser.json({}));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.enableCors();

  app.use(
    compression({
      filter: () => {
        return true;
      },
      threshold: 0,
    }),
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'sessionSecret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.useGlobalFilters(
    new BadRequestExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ConflictExceptionFilter(),
    new InternalServerExceptionFilter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      validateCustomDecorators: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());

  const config = new DocumentBuilder()
    .setTitle('A4PM Test Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    ignoreGlobalPrefix: true,
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(port);

  console.log(`Helloo Company Service listening on port ${port}`);
}

bootstrap();
