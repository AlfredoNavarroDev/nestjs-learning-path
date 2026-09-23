import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // helmet() setea ~15 headers de seguridad con valores razonables por
  // default. Para una API JSON (sin HTML/inline scripts) la CSP default
  // de helmet es demasiado permisiva en directivas que no aplican; la
  // reducimos a lo mínimo: nada de fuentes externas, todo bloqueado salvo
  // lo que la propia API necesite servir (las portadas subidas en /uploads).
  // ── TODO 1: app.use(helmet({ contentSecurityPolicy: { directives: {
  //   defaultSrc: ["'none'"], imgSrc: ["'self'"], frameAncestors: ["'none'"],
  // } }, hsts: { maxAge: 31536000, includeSubDomains: true } })) ──

  // CORS es una capa complementaria, no un reemplazo de Helmet: CORS
  // controla qué *origins* pueden leer la respuesta desde JS de otro
  // dominio; Helmet controla qué puede hacer el *navegador* con la
  // respuesta en sí (framear la página, sniffear el content-type, etc).
  // ── TODO 2: app.enableCors() ──

  await app.listen(3000);
}

bootstrap();
