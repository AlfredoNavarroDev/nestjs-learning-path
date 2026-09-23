import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.interface';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Libro[] {
    return this.librosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Libro {
    return this.librosService.findOne(id);
  }

  @Post()
  create(@Body() body: Omit<Libro, 'id' | 'prestado'>): Libro {
    return this.librosService.create(body);
  }
}
