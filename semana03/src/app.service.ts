import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 3: Providers y Dependency Injection';
  }
}
