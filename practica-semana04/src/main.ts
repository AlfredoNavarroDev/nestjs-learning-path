import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // ── TODO 1: ValidationPipe global con whitelist, forbidNonWhitelisted
  // y transform en true ────────────────────────────────────────

  await app.listen(3000);
}

bootstrap();
