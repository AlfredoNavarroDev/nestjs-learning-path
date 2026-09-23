import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 6: TypeORM — relaciones y Query Builder';
  }
}
