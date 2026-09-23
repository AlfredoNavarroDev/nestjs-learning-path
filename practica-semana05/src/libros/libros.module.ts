import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { AutoresModule } from '../autores/autores.module';

@Module({
  // ── TODO 16: imports: [TypeOrmModule.forFeature([Libro]), AutoresModule] ──
  imports: [AutoresModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}
