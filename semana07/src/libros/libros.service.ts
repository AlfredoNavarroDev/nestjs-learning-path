import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  // Excepción HTTP específica según el caso: 404 si no existe, nunca un 400
  // genérico para "no encontrado" (error común que confunde al cliente).
  findOne(id: string): Libro {
    const libro = this.libros.find((l) => l.id === id);
    if (!libro) throw new NotFoundException(`Libro ${id} no existe`);
    return libro;
  }

  create(data: Omit<Libro, 'id' | 'prestado'>): Libro {
    if (!this.autoresService.existe(data.autorId)) {
      throw new NotFoundException(`Autor ${data.autorId} no existe`);
    }
    if (this.libros.some((l) => l.isbn === data.isbn)) {
      // 409, no 400: el request está bien formado, el conflicto es de estado.
      throw new ConflictException(`Ya existe un libro con isbn ${data.isbn}`);
    }
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
