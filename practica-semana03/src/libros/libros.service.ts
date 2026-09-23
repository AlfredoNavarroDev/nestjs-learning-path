import { Injectable } from '@nestjs/common';
import { AutoresService } from '../autores/autores.service';
import { Libro } from './libro.interface';

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = [
    { id: '1', titulo: 'Clean Code', autorId: '1', prestado: false },
    { id: '2', titulo: 'DDD', autorId: '2', prestado: true },
    { id: '3', titulo: 'Refactoring', autorId: '3', prestado: false },
  ];

  // ── TODO 1: inyectar AutoresService por constructor ──────────
  constructor() {}

  findAll(prestado?: boolean): Libro[] {
    if (prestado === undefined) return this.libros;
    return this.libros.filter((l) => l.prestado === prestado);
  }

  findOne(id: string): Libro | undefined {
    return this.libros.find((l) => l.id === id);
  }

  create(data: Omit<Libro, 'id'>): Libro {
    // ── TODO 2: usar `this.autoresService.existe(data.autorId)` y lanzar
    // un Error si el autor no existe, antes de crear el libro ──────
    const nuevo: Libro = { ...data, id: String(this.libros.length + 1) };
    this.libros.push(nuevo);
    return nuevo;
  }

  marcarPrestado(id: string, prestado: boolean): Libro | undefined {
    const libro = this.findOne(id);
    if (libro) libro.prestado = prestado;
    return libro;
  }

  remove(id: string): void {
    const i = this.libros.findIndex((l) => l.id === id);
    if (i !== -1) this.libros.splice(i, 1);
  }
}
