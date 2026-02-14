import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { SERVICE_PORTS } from '@app/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);

  //Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that do not have any decorators
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
    }),
  )
  await app.listen(SERVICE_PORTS['auth-service']);
}
bootstrap();
