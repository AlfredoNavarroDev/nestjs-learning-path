import { Controller, Get, Param } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { Autor } from './autor.interface';

@Controller('autores')
export class AutoresController {
  // Inyección por constructor: Nest resuelve `AutoresService` usando el tipo
  // declarado (vía reflect-metadata, semana 1) y lo pasa ya instanciado.
  constructor(private readonly autoresService: AutoresService) {}

  @Get()
  findAll(): Autor[] {
    return this.autoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Autor | undefined {
    return this.autoresService.findOne(id);
  }
}
