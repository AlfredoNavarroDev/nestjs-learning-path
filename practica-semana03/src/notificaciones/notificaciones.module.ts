import { Module } from '@nestjs/common';
import { NOTIFICACION_SENDER } from './notificaciones.constants';
import { ConsolaNotificacionService } from './consola-notificacion.service';
import { EmailNotificacionService } from './email-notificacion.service';

@Module({
  providers: [
    ConsolaNotificacionService,
    EmailNotificacionService,
    {
      provide: NOTIFICACION_SENDER,
      // ── TODO 6: useFactory que devuelva EmailNotificacionService si
      // process.env.NOTIFICACION_CANAL === 'email', o ConsolaNotificacionService
      // en cualquier otro caso ─────────────────────────────────────
      useFactory: () => new ConsolaNotificacionService(),
    },
  ],
  exports: [NOTIFICACION_SENDER],
})
export class NotificacionesModule {}
