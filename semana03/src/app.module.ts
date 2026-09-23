import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { AutoresModule } from './autores/autores.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { ConfigDemoModule } from './config/config-demo.module';

@Module({
  imports: [AutoresModule, LibrosModule, PrestamosModule, ConfigDemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
