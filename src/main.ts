import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { ValidationException } from './exceptions/validation.exception';
import { ValidationExceptionFilter } from './filters/validation-exception.filter';
import { GlobalResponseInterceptor } from 'interceptors/global-response.interceptor';
import { GlobalExceptionFilter } from 'filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalFilters(new ValidationExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => new ValidationException(errors),
    }),
  );

  await app.listen(process.env.API_PORT);
}
bootstrap();
