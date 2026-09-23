import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDemoModule } from './config/config-demo.module';
import { validateEnv } from './config/validate-env';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      // `validate` en vez de `validationSchema`: acá el schema es Zod, no
      // Joi. Misma idea de "fallar rápido en el bootstrap", motor distinto.
      validate: validateEnv,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    ConfigDemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
