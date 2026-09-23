import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// ── TODO 8: @Controller({ path: '', version: VERSION_NEUTRAL }) para que
// siga respondiendo en /api sin importar el versionado ────────────
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
