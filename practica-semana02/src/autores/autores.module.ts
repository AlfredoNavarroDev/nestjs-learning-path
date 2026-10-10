import { Module } from '@nestjs/common';
import { AutoresController } from './autores.controller';

@Module({
  // ── TODO 9: registrar AutoresController en este módulo ───────
  controllers: [AutoresController],
})
export class AutoresModule {}
