import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Versionado por URI: /api/v1/libros. `AppController` (sin versión) sigue
  // respondiendo en /api sin cambios.
  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(3000);
}

bootstrap();
