import { Injectable } from '@nestjs/common';

// Ya completo: provider de arranque (la DI se profundiza en la semana 3).
@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 2: Nest CLI, Modules y Controllers';
  }
}
