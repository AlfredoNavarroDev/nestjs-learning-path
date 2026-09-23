import { Injectable } from '@nestjs/common';
import { Autor } from './autor.interface';

@Injectable()
export class AutoresService {
  private readonly autores: Autor[] = [
    { id: '1', nombre: 'Robert Martin', nacionalidad: 'EE.UU.' },
  ];

  findAll(): Autor[] {
    return this.autores;
  }

  existe(id: string): boolean {
    return this.autores.some((a) => a.id === id);
  }
}
