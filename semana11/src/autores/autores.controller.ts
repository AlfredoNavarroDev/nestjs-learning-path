import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AutoresService } from './autores.service';
import { Autor } from './autor.entity';
import { CrearAutorDto } from './dto/crear-autor.dto';
import { ActualizarAutorDto } from './dto/actualizar-autor.dto';

@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Get()
  findAll(): Promise<Autor[]> {
    return this.autoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Autor> {
    return this.autoresService.findOne(id);
  }

  @Post()
  crear(@Body() dto: CrearAutorDto): Promise<Autor> {
    return this.autoresService.crear(dto);
  }

  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAutorDto,
  ): Promise<Autor> {
    return this.autoresService.actualizar(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.autoresService.eliminar(id);
  }
}
