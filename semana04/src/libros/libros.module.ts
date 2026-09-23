import { Module } from '@nestjs/common';
import { LibrosController } from './libros.controller';
import { LibrosService } from './libros.service';
import { AutoresModule } from '../autores/autores.module';

@Module({
  imports: [AutoresModule],
  controllers: [LibrosController],
  providers: [LibrosService],
  exports: [LibrosService],
})
export class LibrosModule {}
