import { Injectable } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { Prestamo } from './prestamo.interface';
import { CrearPrestamoDto } from './dto/crear-prestamo.dto';

@Injectable()
export class PrestamosService {
  private readonly prestamos: Prestamo[] = [];

  constructor(private readonly librosService: LibrosService) {}

  crear(dto: CrearPrestamoDto): Prestamo {
    const nuevo: Prestamo = {
      id: String(this.prestamos.length + 1),
      libroId: dto.libroId,
      usuario: dto.solicitante.nombre,
      fecha: new Date().toISOString(),
    };
    this.prestamos.push(nuevo);
    return nuevo;
  }

  findAll(): Prestamo[] {
    return this.prestamos;
  }
}
