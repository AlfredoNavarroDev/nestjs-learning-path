import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 7: Exception Filters y manejo de errores';
  }
}
