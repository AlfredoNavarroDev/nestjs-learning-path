import { Injectable, Scope } from '@nestjs/common';

// Scope.REQUEST: Nest crea una instancia NUEVA de esta clase por cada
// request entrante (en vez de una única instancia para toda la app).
// Trade-off: más overhead que el scope DEFAULT (singleton); solo se justifica
// cuando de verdad necesitás estado por-request (ej. datos del usuario actual).
@Injectable({ scope: Scope.REQUEST })
export class RequestContextService {
  readonly creadoEn: number = Date.now();

  getTimestamp(): number {
    return this.creadoEn;
  }
}
