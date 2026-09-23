import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/libros.module';
import { AutoresModule } from './autores/autores.module';

@Module({
  // ── TODO 3: conectar los módulos de feature al módulo raíz ──
  // imports: [LibrosModule, AutoresModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
