import { Module } from '@nestjs/common';
import { NOTIFICACION_SENDER } from './notificaciones.constants';
import { ConsolaNotificacionService } from './consola-notificacion.service';
import { EmailNotificacionService } from './email-notificacion.service';

@Module({
  providers: [
    ConsolaNotificacionService,
    EmailNotificacionService,
    {
      // Custom provider por token: quien inyecte `@Inject(NOTIFICACION_SENDER)`
      // recibe una u otra implementación según `NOTIFICACION_CANAL`, sin tocar
      // el código que consume la interfaz `NotificacionSender`.
      provide: NOTIFICACION_SENDER,
      useFactory: () =>
        process.env.NOTIFICACION_CANAL === 'email'
          ? new EmailNotificacionService()
          : new ConsolaNotificacionService(),
    },
  ],
  exports: [NOTIFICACION_SENDER],
})
export class NotificacionesModule {}
