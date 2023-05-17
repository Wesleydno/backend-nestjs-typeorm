import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response.interceptor';
import { GenericExceptionFilter } from './generic-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from 'exceptionFactory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        throw exceptionFactory(errors);
      },
    }),
  );

  app.useGlobalFilters(new GenericExceptionFilter());

  await app.listen(process.env.API_PORT);
}
bootstrap();
