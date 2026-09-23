import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { AutoresModule } from './autores/autores.module';

// Módulo raíz: ensambla los módulos de feature.
// Equivalente a la clase con @SpringBootApplication (que escanea componentes).
@Module({
  imports: [LibrosModule, AutoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
