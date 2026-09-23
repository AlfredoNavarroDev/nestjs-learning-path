import { Module } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { LibrosModule } from '../libros/libros.module';

@Module({
  imports: [LibrosModule],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
