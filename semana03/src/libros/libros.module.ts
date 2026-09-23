import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { AutoresModule } from '../autores/autores.module';

@Module({
  // LibrosService depende de AutoresService: por eso este módulo importa
  // AutoresModule (que lo exporta). Sin este import, Nest no sabría resolverlo.
  imports: [AutoresModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}
