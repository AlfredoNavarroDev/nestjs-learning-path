import { Body, Controller, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Post()
  crear(@Body() body: { libroId: string }) {
    return this.prestamosService.crear(body.libroId);
  }
}
