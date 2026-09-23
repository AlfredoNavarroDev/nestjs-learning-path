import { Injectable } from '@nestjs/common';

// @Injectable() = @Service/@Component en Spring: lo marca como provider inyectable.
// La DI por constructor se ve a fondo en la semana 3.
@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 2: Nest CLI, Modules y Controllers';
  }
}
