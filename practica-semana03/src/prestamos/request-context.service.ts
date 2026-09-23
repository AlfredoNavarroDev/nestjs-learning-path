import { Injectable } from '@nestjs/common';

// ── TODO 3: marcar esta clase con scope REQUEST ──────────────────
// import { Scope } from '@nestjs/common';
// @Injectable({ scope: Scope.REQUEST })
@Injectable()
export class RequestContextService {
  // ── TODO 4: capturar Date.now() al construirse ─────────────────
  readonly creadoEn: number = 0;

  getTimestamp(): number {
    return this.creadoEn;
  }
}
