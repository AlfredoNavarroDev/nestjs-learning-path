import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Autor } from './autor.entity';
import { AutoresController } from './autores.controller';
import { AutoresService } from './autores.service';

@Module({
  // ── TODO 12: imports: [TypeOrmModule.forFeature([Autor])] ─────
  imports: [],
  controllers: [AutoresController],
  providers: [AutoresService],
  exports: [AutoresService],
})
export class AutoresModule {}
