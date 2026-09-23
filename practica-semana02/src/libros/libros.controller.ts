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
    return libros;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Libro | undefined {
    // ── TODO 6: devolver el libro con ese id ───────────────────
    return undefined;
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: Omit<Libro, 'id'>): Libro {
    // ── TODO 7: crear libro con id nuevo y agregarlo a `libros` ──
    throw new Error('TODO: implementar create');
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    // ── TODO 8: eliminar el libro con ese id ───────────────────
  }
}
