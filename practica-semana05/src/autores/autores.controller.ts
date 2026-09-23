import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { Autor } from './autor.entity';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get()
  findAll(): Promise<Autor[]> {
    return this.autoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Autor | null> {
    return this.autoresService.findOne(id);
  }

  @Post()
  create(@Body() body: Omit<Autor, 'id'>): Promise<Autor> {
    return this.autoresService.create(body);
  }
}
