import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LibrosService, Libro } from './libros.service';
import { CrearLibroDto } from './dto/crear-libro.dto';
import { ActualizarLibroDto } from './dto/actualizar-libro.dto';
import { IsbnValidationPipe } from '../common/pipes/isbn-validation.pipe';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Libro[] {
    return this.librosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Libro | undefined {
    return this.librosService.findOne(id);
  }

  // El body ya llega tipado y validado como CrearLibroDto: si falta un campo
  // o sobra uno no declarado, ValidationPipe global responde 400 antes de
  // que este método se ejecute.
  @Post()
  create(@Body() dto: CrearLibroDto): Libro {
    return this.librosService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: ActualizarLibroDto,
  ): Libro | undefined {
    return this.librosService.update(id, dto);
  }

  // Pipe personalizado aplicado a un @Param: valida el formato de ISBN
  // antes de que el valor llegue al método.
  @Get('isbn/:isbn')
  buscarPorIsbn(
    @Param('isbn', IsbnValidationPipe) isbn: string,
  ): Libro | undefined {
    return this.librosService.findAll().find((l) => l.isbn === isbn);
  }
}
