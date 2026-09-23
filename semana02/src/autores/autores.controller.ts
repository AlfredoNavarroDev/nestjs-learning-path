import { Controller, Get, Param } from '@nestjs/common';

interface Autor {
  id: string;
  nombre: string;
  nacionalidad: string;
}

const autores: Autor[] = [
  { id: '1', nombre: 'Robert Martin', nacionalidad: 'EE.UU.' },
  { id: '2', nombre: 'Eric Evans', nacionalidad: 'EE.UU.' },
  { id: '3', nombre: 'Martin Fowler', nacionalidad: 'Reino Unido' },
];

@Controller('autores')
export class AutoresController {
  @Get()
  findAll(): Autor[] {
    return autores;
  }

  @Get(':id')
  findOne(@Param('id') id: string): Autor | undefined {
    return autores.find((a) => a.id === id);
  }
}
