import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Filter global: cualquier excepción no capturada en algún punto más
  // específico termina acá, con el formato de error estándar del proyecto.
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3000);
}

bootstrap();
