import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controller sin prefijo de ruta → responde en `/api` (por el prefijo global).
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
