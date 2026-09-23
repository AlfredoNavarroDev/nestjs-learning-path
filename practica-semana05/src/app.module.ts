import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoresModule } from './autores/autores.module';
import { LibrosModule } from './libros/libros.module';
import { Autor } from './autores/autor.entity';
import { Libro } from './libros/libro.entity';

@Module({
  imports: [
    // ── TODO 17: TypeOrmModule.forRoot({ type: 'postgres', host, port,
    // username, password, database, entities: [Autor, Libro], synchronize: false }) ──
    AutoresModule,
    LibrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
