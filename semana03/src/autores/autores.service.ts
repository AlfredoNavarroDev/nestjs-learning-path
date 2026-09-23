import { Injectable } from '@nestjs/common';
import { Autor } from './autor.interface';

// @Injectable() marca la clase como Provider: Nest la registra en su contenedor
// de IoC y puede resolverla para inyectarla en quien la pida por constructor.
// Equivalente directo a @Service en Spring (mismo scope singleton por defecto).
@Injectable()
export class AutoresService {
  private readonly autores: Autor[] = [
    { id: '1', nombre: 'Robert Martin', nacionalidad: 'EE.UU.' },
    { id: '2', nombre: 'Eric Evans', nacionalidad: 'EE.UU.' },
    { id: '3', nombre: 'Martin Fowler', nacionalidad: 'Reino Unido' },
  ];

  findAll(): Autor[] {
    return this.autores;
  }

  findOne(id: string): Autor | undefined {
    return this.autores.find((a) => a.id === id);
  }

  existe(id: string): boolean {
    return this.autores.some((a) => a.id === id);
  }
}
