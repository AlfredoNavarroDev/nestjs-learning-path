import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactory.create() crea el ApplicationContext desde el módulo raíz.
  const app = await NestFactory.create(AppModule);

  // ── TODO 1: prefijo global de rutas ─────────────────────────
  // app.setGlobalPrefix('api');

  // ── TODO 2: habilitar CORS ──────────────────────────────────
  // app.enableCors();

  await app.listen(3000);
}

bootstrap();
