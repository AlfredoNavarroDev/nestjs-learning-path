import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // NestFactory.create() crea el ApplicationContext a partir del módulo raíz.
  // Equivalente a SpringApplication.run(App.class, args) en Spring Boot.
  const app = await NestFactory.create(AppModule);

  // Prefijo global de rutas: equivalente a server.servlet.context-path + @RequestMapping.
  app.setGlobalPrefix('api');

  // CORS habilitado: equivalente a @CrossOrigin o un WebMvcConfigurer en Spring.
  app.enableCors();

  await app.listen(3000);
}

bootstrap();
