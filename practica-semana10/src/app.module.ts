import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { PrestamosModule } from './prestamos/prestamos.module';

@Module({
  imports: [LibrosModule, PrestamosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
