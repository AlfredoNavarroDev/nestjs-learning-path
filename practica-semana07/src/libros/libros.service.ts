import { Injectable } from '@nestjs/common';
import { AutoresService } from '../autores/autores.service';
import { Libro } from './libro.interface';

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = [
    { id: '1', titulo: 'Clean Code', isbn: '978-0132350884', autorId: '1', prestado: false },
  ];

  constructor(private readonly autoresService: AutoresService) {}

  findAll(): Libro[] {
    return this.libros;
  }

  findOne(id: string): Libro {
    const libro = this.libros.find((l) => l.id === id);
    // ── TODO 1: si no existe, lanzar new NotFoundException(...) ────
    return libro as Libro;
  }

  create(data: Omit<Libro, 'id' | 'prestado'>): Libro {
    // ── TODO 2: si el autor no existe (this.autoresService.existe),
    // lanzar NotFoundException ──────────────────────────────────
    // ── TODO 3: si ya existe un libro con ese isbn, lanzar
    // ConflictException ─────────────────────────────────────────
    const nuevo: Libro = { ...data, id: String(this.libros.length + 1), prestado: false };
    this.libros.push(nuevo);
    return nuevo;
  }

  marcarPrestado(id: string, prestado: boolean): Libro {
    const libro = this.findOne(id);
    libro.prestado = prestado;
    return libro;
  }
}
