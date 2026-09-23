import { Injectable } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { LibroNoDisponibleException } from '../common/exceptions/libro-no-disponible.exception';

@Injectable()
export class PrestamosService {
  constructor(private readonly librosService: LibrosService) {}

  crear(libroId: string): { libroId: string; prestado: true } {
    const libro = this.librosService.findOne(libroId); // 404 si no existe
    if (libro.prestado) {
      // Excepción de dominio propia en vez de una genérica ConflictException:
      // el mensaje y el caso son específicos de "préstamo de biblioteca".
      throw new LibroNoDisponibleException(libroId);
    }
    this.librosService.marcarPrestado(libroId, true);
    return { libroId, prestado: true };
  }
}
