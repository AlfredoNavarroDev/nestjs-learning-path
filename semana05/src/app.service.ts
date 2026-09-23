import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Biblioteca API — Semana 5: TypeORM — Entities y Repository';
  }
}
