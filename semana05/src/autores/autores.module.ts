import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autor } from './autor.entity';
import { AutoresController } from './autores.controller';
import { AutoresService } from './autores.service';

@Module({
  // forFeature() registra la entity SOLO en este módulo (a diferencia de
  // forRoot(), que configura la conexión una vez a nivel de AppModule).
  imports: [TypeOrmModule.forFeature([Autor])],
  controllers: [AutoresController],
  providers: [AutoresService],
  exports: [AutoresService],
})
export class AutoresModule {}
