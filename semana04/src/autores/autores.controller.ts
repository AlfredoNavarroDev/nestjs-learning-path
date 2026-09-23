import { Controller, Get } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { Autor } from './autor.interface';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get()
  findAll(): Autor[] {
    return this.autoresService.findAll();
  }
}
