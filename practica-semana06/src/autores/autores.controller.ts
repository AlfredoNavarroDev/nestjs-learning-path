import { Controller, Get } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { Autor } from './autor.entity';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get()
  findAll(): Promise<Autor[]> {
    return this.autoresService.findAll();
  }
}
