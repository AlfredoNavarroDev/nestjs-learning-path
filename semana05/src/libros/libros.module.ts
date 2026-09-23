import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Libro } from './libro.entity';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { AutoresModule } from '../autores/autores.module';

@Module({
  imports: [TypeOrmModule.forFeature([Libro]), AutoresModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}
