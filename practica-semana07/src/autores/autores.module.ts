import { Module } from '@nestjs/common';
import { AutoresService } from './autores.service';

@Module({
  providers: [AutoresService],
  exports: [AutoresService],
})
export class AutoresModule {}
