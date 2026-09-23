import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { LibrosService } from './libros.service';
import { Libro } from './libro.interface';

@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  @Get()
  findAll(@Query('prestado') prestado?: string): Libro[] {
    if (prestado === undefined) return this.librosService.findAll();
    return this.librosService.findAll(prestado === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string): Libro | undefined {
    return this.librosService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: Omit<Libro, 'id'>): Libro {
    return this.librosService.create(body);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.librosService.remove(id);
  }
}
