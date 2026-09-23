import { Controller, Get } from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.interface';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Libro[] {
    return this.librosService.findAll();
  }
}
