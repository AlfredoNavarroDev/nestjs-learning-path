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
    // TypeOrmModule.forRoot(): conexión global, una sola vez, en el módulo
    // raíz — equivalente a las propiedades `spring.datasource.*` de Spring.
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'biblioteca',
      entities: [Autor, Libro],
      synchronize: false, // las migraciones (src/migrations) crean el schema
    }),
    AutoresModule,
    LibrosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
