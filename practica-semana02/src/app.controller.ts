import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Ya completo: controller de arranque que genera `nest new`.
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
