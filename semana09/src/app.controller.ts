import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

// VERSION_NEUTRAL: responde en /api sin importar el versionado activado,
// para endpoints que no necesitan versionarse (ej. un healthcheck).
@Controller({ path: '', version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
