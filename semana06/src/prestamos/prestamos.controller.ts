import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.entity';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Get()
  findAll(): Promise<Prestamo[]> {
    return this.prestamosService.findAll();
  }

  @Post()
  crear(@Body() body: { libroId: string; usuarioId: string }): Promise<Prestamo> {
    return this.prestamosService.crear(body.libroId, body.usuarioId);
  }

  @Post('devolver')
  async devolver(@Body() body: { libroId: string }): Promise<{ ok: true }> {
    await this.prestamosService.devolver(body.libroId);
    return { ok: true };
  }
}
