import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { envValidationSchema } from './config/env.validation';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    // isGlobal: true evita reimportar ConfigModule en cada feature module.
    // Carga el .env correcto según NODE_ENV; si no existe, cae a variables
    // de entorno del sistema (el caso normal dentro de un contenedor).
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV ?? 'development'}`, '.env'],
      validationSchema: envValidationSchema,
      load: [appConfig, databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        entities: [Autor, Libro, Usuario, Prestamo],
        // Proyecto de aprendizaje: synchronize:true simplifica el deploy
        // (no hay que correr migraciones a mano en Render/Railway). En un
        // proyecto real de producción esto se reemplaza por migraciones
        // versionadas (como en las semanas 5-6) antes de arrancar la app.
        synchronize: true,
      }),
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
