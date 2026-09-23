import { Injectable } from '@nestjs/common';
import { Libro } from './libro.interface';

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = [
    { id: '1', titulo: 'Clean Code' },
    { id: '2', titulo: 'The Pragmatic Programmer' },
  ];

  findAll(): Libro[] {
    return this.libros;
  }
}
