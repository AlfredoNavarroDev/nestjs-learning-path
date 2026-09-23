import { Injectable } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { Prestamo } from './prestamo.interface';

@Injectable()
export class PrestamosService {
  private readonly prestamos: Prestamo[] = [];

  // ── TODO 7: inyectar LibrosService por constructor, y
  // NotificacionSender por token con @Inject(NOTIFICACION_SENDER) ──
  constructor(private readonly librosService: LibrosService) {}

  crear(libroId: string, usuario: string): Prestamo {
    const libro = this.librosService.findOne(libroId);
    if (!libro || libro.prestado) {
      throw new Error(`Libro ${libroId} no disponible para préstamo`);
    }
    this.librosService.marcarPrestado(libroId, true);
    const nuevo: Prestamo = {
      id: String(this.prestamos.length + 1),
      libroId,
      usuario,
      fecha: new Date().toISOString(),
    };
    this.prestamos.push(nuevo);
    // ── TODO 8: notificar con this.notificacionSender.enviar(...) ──
    return nuevo;
  }

  devolver(libroId: string): void {
    this.librosService.marcarPrestado(libroId, false);
    // ── TODO 9: notificar la devolución ────────────────────────
  }

  findAll(): Prestamo[] {
    return this.prestamos;
  }
}
