import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.entity';
import { CrearPrestamoDto } from './dto/crear-prestamo.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Get()
  findAll(): Promise<Prestamo[]> {
    return this.prestamosService.findAll();
  }

  @Post()
  crear(@Body() dto: CrearPrestamoDto): Promise<Prestamo> {
    return this.prestamosService.crear(dto.libroId, dto.usuarioId);
  }

  @Patch(':libroId/devolver')
  async devolver(@Param('libroId') libroId: string): Promise<{ ok: true }> {
    await this.prestamosService.devolver(libroId);
    return { ok: true };
  }
}
