import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  // Servir los archivos subidos como estáticos, fuera del prefijo /api
  // (así /uploads/portadas/x.png es la URL pública real de la imagen).
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(3000);
}

bootstrap();
