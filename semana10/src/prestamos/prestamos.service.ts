import { Injectable, Logger } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';

@Injectable()
export class PrestamosService {
  // Logger con contexto = nombre de la clase: cada línea logueada se puede
  // rastrear a qué service la generó, sin tener que loguear el nombre a mano.
  private readonly logger = new Logger(PrestamosService.name);

  constructor(private readonly librosService: LibrosService) {}

  crear(libroId: string): { libroId: string } {
    this.librosService.findOne(libroId); // 404 si no existe
    this.logger.log(`Préstamo creado para el libro ${libroId}`);
    return { libroId };
  }

  devolver(libroId: string): void {
    this.librosService.findOne(libroId);
    this.logger.log(`Libro ${libroId} devuelto`);
  }
}
