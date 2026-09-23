import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDemoModule } from './config/config-demo.module';
import { envValidationSchema } from './config/env.validation';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    // isGlobal: true evita reimportar ConfigModule en cada feature module
    // (equivalente a que `application.properties` esté disponible en toda
    // la app de Spring sin declarar nada extra por módulo).
    ConfigModule.forRoot({
      isGlobal: true,
      // Carga el .env correcto según NODE_ENV: .env.development / .env.test
      // / .env.production. Si no existe ninguno, cae a variables de entorno
      // del sistema (útil en un contenedor donde no hay archivo .env).
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    ConfigDemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
