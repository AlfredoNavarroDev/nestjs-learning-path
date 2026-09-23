import { Body, Controller, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  crear(@Body() body: { libroId: string }) {
    return this.prestamosService.crear(body.libroId);
  }

  @Post('devolver')
  devolver(@Body() body: { libroId: string }): { ok: true } {
    this.prestamosService.devolver(body.libroId);
    return { ok: true };
  }
}
