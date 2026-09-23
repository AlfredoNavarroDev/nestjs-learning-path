import { Injectable, NotFoundException } from '@nestjs/common';
import { Libro } from './libro.interface';

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = [{ id: '1', titulo: 'Clean Code' }];

  findOne(id: string): Libro {
    const libro = this.libros.find((l) => l.id === id);
    if (!libro) throw new NotFoundException(`Libro ${id} no existe`);
    return libro;
  }

  setPortada(id: string, filename: string): Libro {
    const libro = this.findOne(id);
    libro.portadaUrl = `/uploads/portadas/${filename}`;
    return libro;
  }
}
