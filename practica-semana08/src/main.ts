import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const configService = app.get(ConfigService);
  // ── TODO 7: usar configService.get('app.puerto') en vez de 3000 fijo ──
  await app.listen(3000);
}

bootstrap();
