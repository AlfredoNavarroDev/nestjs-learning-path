import { HttpException, HttpStatus } from '@nestjs/common';

// ── TODO 7: hacer que esta clase extienda HttpException, con
// super(mensaje, HttpStatus.CONFLICT) ──────────────────────────
export class LibroNoDisponibleException {
  constructor(libroId: string) {}
}
