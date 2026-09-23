import { Inject, Injectable } from '@nestjs/common';
import { LibrosService } from '../libros/libros.service';
import { NOTIFICACION_SENDER } from '../notificaciones/notificaciones.constants';
import { NotificacionSender } from '../notificaciones/notificacion-sender.interface';
import { Prestamo } from './prestamo.interface';

@Injectable()
export class PrestamosService {
  private readonly prestamos: Prestamo[] = [];

  constructor(
    private readonly librosService: LibrosService,
    // Inyección por token: NotificacionSender es una interfaz, no una clase,
    // así que no se puede inyectar por tipo (se borra al compilar a JS).
    @Inject(NOTIFICACION_SENDER)
    private readonly notificacionSender: NotificacionSender,
  ) {}

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
    this.notificacionSender.enviar(
      `Préstamo creado: libro ${libroId} para ${usuario}`,
    );
    return nuevo;
  }

  devolver(libroId: string): void {
    this.librosService.marcarPrestado(libroId, false);
    this.notificacionSender.enviar(`Libro ${libroId} devuelto`);
  }

  findAll(): Prestamo[] {
    return this.prestamos;
  }
}
