import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.entity';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(): Promise<Libro[]> {
    return this.librosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Libro | null> {
    return this.librosService.findOne(id);
  }

  @Post()
  create(@Body() body: Omit<Libro, 'id'>): Promise<Libro> {
    return this.librosService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Partial<Libro>,
  ): Promise<Libro | null> {
    return this.librosService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.librosService.remove(id);
  }
}
