import { Controller, Get, Query } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { ResultadoPaginado, Libro } from './libro.interface';

const SORT_PERMITIDOS = ['titulo', 'categoria'] as const;

@Controller({ path: 'libros', version: '1' })
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // GET /v1/libros?page=1&limit=5&categoria=ficcion&disponible=true&sort=titulo&order=asc
  @Get()
  buscar(
    @Query('page') page = '1',
    @Query('limit') limit = '5',
    @Query('categoria') categoria?: string,
    @Query('disponible') disponible?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ): ResultadoPaginado<Libro> {
    const sortSeguro = SORT_PERMITIDOS.includes(sort as any)
      ? (sort as 'titulo' | 'categoria')
      : undefined;

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
