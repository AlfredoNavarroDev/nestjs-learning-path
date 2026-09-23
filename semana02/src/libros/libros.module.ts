import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';

// Módulo de feature: encapsula todo lo de "libros".
// Esta semana solo tiene su controller; la semana 3 le suma providers (service).
@Module({
  controllers: [LibrosController],
})
export class LibrosModule {}
