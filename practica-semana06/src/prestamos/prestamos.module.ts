import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prestamo } from './prestamo.entity';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { LibrosModule } from '../libros/libros.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prestamo]), LibrosModule],
  controllers: [PrestamosController],
  providers: [PrestamosService],
})
export class PrestamosModule {}
