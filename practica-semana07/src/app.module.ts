import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoresModule } from './autores/autores.module';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';

@Module({
  imports: [AutoresModule, LibrosModule, PrestamosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
