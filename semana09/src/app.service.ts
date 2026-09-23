import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 9: Paginación, filtros y versionado';
  }
}
