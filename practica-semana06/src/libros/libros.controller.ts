import { Controller, Get, Param, Query } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.librosService.findAllConAutores();
  }

  // GET /libros/buscar?titulo=clean&autorId=<uuid>&disponible=true
  @Get('buscar')
  buscar(
    @Query('titulo') titulo?: string,
    @Query('autorId') autorId?: string,
    @Query('disponible') disponible?: string,
  ): Promise<Libro[]> {
    return this.librosService.buscar({
      titulo,
      autorId,
      disponible: disponible === undefined ? undefined : disponible === 'true',
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Libro | null> {
    return this.librosService.findOne(id);
  }
}
