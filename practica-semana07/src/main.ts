import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // ── TODO 9: app.useGlobalFilters(new AllExceptionsFilter()) ────

  await app.listen(3000);
}

bootstrap();
