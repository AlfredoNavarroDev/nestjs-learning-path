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

interface Libro {
  id: string;
  titulo: string;
  autor: string;
  prestado: boolean;
}

// Datos hardcodeados en memoria: esta semana aún no hay service ni BD (semana 5+).
const libros: Libro[] = [
  { id: '1', titulo: 'Clean Code', autor: 'Robert Martin', prestado: false },
  { id: '2', titulo: 'DDD', autor: 'Eric Evans', prestado: true },
  { id: '3', titulo: 'Refactoring', autor: 'Martin Fowler', prestado: false },
];

// @Controller('libros') = @RestController + @RequestMapping("/libros") en Spring.
@Controller('libros')
export class LibrosController {
  // @Get() = @GetMapping. @Query() = @RequestParam.
  @Get()
  findAll(@Query('prestado') prestado?: string): Libro[] {
    if (prestado !== undefined) {
      return libros.filter((l) => l.prestado === (prestado === 'true'));
    }
    return libros;
  }

  // @Get(':id') + @Param() = @GetMapping("/{id}") + @PathVariable.
  @Get(':id')
  findOne(@Param('id') id: string): Libro | undefined {
    return libros.find((l) => l.id === id);
  }

  // @Post() + @Body() = @PostMapping + @RequestBody.
  // @HttpCode(201): Nest por defecto responde 201 en POST, acá se hace explícito.
  @Post()
  @HttpCode(201)
  create(@Body() body: Omit<Libro, 'id'>): Libro {
    const nuevo: Libro = { ...body, id: String(libros.length + 1) };
    libros.push(nuevo);
    return nuevo;
  }

  // @Delete() + @HttpCode(204) = @DeleteMapping + ResponseEntity.noContent().
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    const i = libros.findIndex((l) => l.id === id);
    if (i !== -1) {
      libros.splice(i, 1);
    }
  }
}
