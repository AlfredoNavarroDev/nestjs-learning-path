import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // ValidationPipe global: cada @Body()/@Query()/@Param() tipado con un DTO
  // se valida automáticamente antes de llegar al controller.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // descarta propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // 400 si llega una propiedad extra
      transform: true, // castea primitivos (ej. query "5" -> number 5)
    }),
  );

  await app.listen(3000);
}

bootstrap();
