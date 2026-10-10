import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  prestado: boolean;
}

// ── Ya completo: datos hardcodeados (sin service ni BD todavía) ──
const libros: Libro[] = [
  { id: '1', titulo: 'Clean Code', autor: 'Robert Martin', prestado: false },
  { id: '2', titulo: 'DDD', autor: 'Eric Evans', prestado: true },
  { id: '3', titulo: 'Refactoring', autor: 'Martin Fowler', prestado: false },
];

@Controller('libros')
export class LibrosController {
  @Get()
  findAll(@Query('prestado') prestado?: string): Libro[] {
    // ── TODO 5: si viene `prestado`, filtrar; si no, devolver todos ──
    if (prestado !== undefined) {
      return libros.filter((libro) => libro.prestado === (prestado === 'true'));
    }
    return libros;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Libro | undefined {
    // ── TODO 6: devolver el libro con ese id ───────────────────
    return libros.find((libro) => libro.id === id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: Omit<Libro, 'id'>): Libro {
    // ── TODO 7: crear libro con id nuevo y agregarlo a `libros` ──
    const nuevoLibro: Libro = {
      id: (libros.length + 1).toString(),
      titulo: body.titulo,
      autor: body.autor,
      prestado: body.prestado,
    };

    libros.push(nuevoLibro);

    return nuevoLibro;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    // ── TODO 8: eliminar el libro con ese id ───────────────────
    const index = libros.findIndex(libro => libro.id === id);
    if (index !== -1) {
      libros.splice(index, 1);
    }
  }
}
