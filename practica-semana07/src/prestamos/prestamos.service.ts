import { Injectable } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { LibroNoDisponibleException } from '../common/exceptions/libro-no-disponible.exception';

@Injectable()
export class PrestamosService {
  constructor(private readonly librosService: LibrosService) {}

  crear(libroId: string): { libroId: string; prestado: true } {
    const libro = this.librosService.findOne(libroId);
    // ── TODO 8: si libro.prestado, lanzar new LibroNoDisponibleException(libroId) ──
    this.librosService.marcarPrestado(libroId, true);
    return { libroId, prestado: true };
  }
}
