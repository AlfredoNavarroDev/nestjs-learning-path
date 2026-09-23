import { HttpException, HttpStatus } from '@nestjs/common';

// Excepción de dominio propia: se justifica porque "libro no disponible" es
// una regla de negocio específica de Biblioteca, no un error HTTP genérico.
// extends HttpException le da forma de respuesta HTTP sin reinventar nada.
export class LibroNoDisponibleException extends HttpException {
  constructor(libroId: string) {
    super(
      `El libro ${libroId} no está disponible para préstamo`,
      HttpStatus.CONFLICT,
    );
  }
}
