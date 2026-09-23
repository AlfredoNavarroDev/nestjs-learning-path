import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  // ── TODO 1: app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' }) ──
  app.enableCors();

  // ── TODO 2: app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true })) ──
  // ── TODO 3: app.useGlobalFilters(new AllExceptionsFilter()) ──
  // ── TODO 4: app.useGlobalInterceptors(new LoggingInterceptor()) ──

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

bootstrap();
