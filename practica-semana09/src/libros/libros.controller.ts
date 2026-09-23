import { Controller, Get, Query } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { ResultadoPaginado, Libro } from './libro.interface';

const SORT_PERMITIDOS = ['titulo', 'categoria'] as const;

// ── TODO 5: @Controller({ path: 'libros', version: '1' }) ────────
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  buscar(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('categoria') categoria?: string,
    @Query('disponible') disponible?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ): ResultadoPaginado<Libro> {
    // ── TODO 6: validar `sort` contra SORT_PERMITIDOS antes de usarlo ──
    const sortSeguro = undefined;

    return this.librosService.buscar({
      page: Number(page),
      limit: Number(limit),
      categoria,
      disponible: disponible === undefined ? undefined : disponible === 'true',
      sort: sortSeguro,
      order: order === 'desc' ? 'desc' : 'asc',
    });
  }
}
