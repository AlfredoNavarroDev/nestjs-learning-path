import { Injectable } from '@nestjs/common';
import { AutoresService } from '../autores/autores.service';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';

export interface Libro extends CrearLibroDto {
  id: string;
}

@Injectable()
export class LibrosService {
  private readonly libros: Libro[] = [
    {
      id: '1',
      titulo: 'Clean Code',
      autorId: '1',
      isbn: '978-0132350884',
      anio: 2008,
      prestado: false,
    },
  ];

  constructor(private readonly autoresService: AutoresService) {}

  findAll(): Libro[] {
    return this.libros;
  }

  findOne(id: string): Libro | undefined {
    return this.libros.find((l) => l.id === id);
  }

  create(dto: CrearLibroDto): Libro {
    if (!this.autoresService.existe(dto.autorId)) {
      throw new Error(`Autor ${dto.autorId} no existe`);
    }
    const nuevo: Libro = { ...dto, prestado: dto.prestado ?? false, id: String(this.libros.length + 1) };
    this.libros.push(nuevo);
    return nuevo;
  }

  update(id: string, dto: ActualizarLibroDto): Libro | undefined {
    const libro = this.findOne(id);
    if (!libro) return undefined;
    Object.assign(libro, dto);
    return libro;
  }
}
