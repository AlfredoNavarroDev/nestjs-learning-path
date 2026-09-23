import { Module } from '@nestjs/common';
import { AutoresController } from './autores.controller';
import { AutoresService } from './autores.service';

@Module({
  controllers: [AutoresController],
  providers: [AutoresService],
  // exports: sin esto, ningún otro módulo (ej. LibrosModule) podría inyectar
  // AutoresService. Es el equivalente a exponer un @Bean reutilizable.
  exports: [AutoresService],
})
export class AutoresModule {}
