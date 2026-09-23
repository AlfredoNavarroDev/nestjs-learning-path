import { Module } from '@nestjs/common';
import { PrestamosController } from './prestamos.controller';
import { PrestamosService } from './prestamos.service';
import { RequestContextService } from './request-context.service';
import { LibrosModule } from '../libros/libros.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [LibrosModule, NotificacionesModule],
  controllers: [PrestamosController],
  providers: [PrestamosService, RequestContextService],
})
export class PrestamosModule {}
