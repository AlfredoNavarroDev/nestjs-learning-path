import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('app.puerto') ?? 3000);
}

bootstrap();
