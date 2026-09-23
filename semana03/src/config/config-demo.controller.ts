import { Controller, Get, Inject } from '@nestjs/common';
import { APP_CONFIG, AppConfig } from './config-demo.provider';

@Controller('config-demo')
export class ConfigDemoController {
  // Inyección por token: `AppConfig` es una interfaz (se borra al compilar),
  // por eso se inyecta con @Inject(APP_CONFIG) en vez de por tipo.
  constructor(@Inject(APP_CONFIG) private readonly config: AppConfig) {}

  @Get()
  getConfig(): AppConfig {
    return this.config;
  }
}
