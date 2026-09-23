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
    ConfigModule.forRoot({
      // ── TODO 4: isGlobal: true ────────────────────────────
      // ── TODO 5: envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'] ──
      validationSchema: envValidationSchema,
      // ── TODO 6: load: [appConfig, databaseConfig, jwtConfig] ──
    }),
    ConfigDemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
