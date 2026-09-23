import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AutoresModule } from './autores/autores.module';
import { LibrosModule } from './libros/libros.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PrestamosModule } from './prestamos/prestamos.module';
import { Autor } from './autores/autor.entity';
import { Libro } from './libros/libro.entity';
import { Usuario } from './usuarios/usuario.entity';
import { Prestamo } from './prestamos/prestamo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'biblioteca',
      entities: [Autor, Libro, Usuario, Prestamo],
      synchronize: false,
    }),
    AutoresModule,
    LibrosModule,
    UsuariosModule,
    PrestamosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
