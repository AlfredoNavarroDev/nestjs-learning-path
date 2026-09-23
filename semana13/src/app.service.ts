import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — semana 13: validación de entorno con Zod';
  }
}
