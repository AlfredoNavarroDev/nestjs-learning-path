import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';

// VERSION_NEUTRAL: /api/health responde sin importar la versión pedida,
// útil para el healthcheck de Docker/Render que no debe depender de /v1.
@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health(): { status: string; timestamp: string } {
    return this.appService.health();
  }
}
