import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { Prestamo } from './prestamo.interface';
import { CrearPrestamoDto } from './dto/crear-prestamo.dto';

@Controller('prestamos')
export class PrestamosController {
  constructor(private readonly prestamosService: PrestamosService) {}

  @Get()
  findAll(): Prestamo[] {
    return this.prestamosService.findAll();
  }

  @Post()
  crear(@Body() dto: CrearPrestamoDto): Prestamo {
    return this.prestamosService.crear(dto);
  }
}
