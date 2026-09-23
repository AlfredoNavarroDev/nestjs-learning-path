import { HttpException, HttpStatus } from '@nestjs/common';

// Excepción de dominio: "libro no disponible" es una regla de negocio de
// Biblioteca, no un error HTTP genérico.
export class LibroNoDisponibleException extends HttpException {
  constructor(libroId: string) {
    super(
      `El libro ${libroId} no está disponible para préstamo`,
      HttpStatus.CONFLICT,
    );
  }
}
