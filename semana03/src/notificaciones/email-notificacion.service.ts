import { Injectable, Logger } from '@nestjs/common';
import { NotificacionSender } from './notificacion-sender.interface';

// Implementación simulada: en un proyecto real llamaría a un proveedor de
// email (SES, SendGrid...). Acá solo demuestra que hay dos implementaciones
// intercambiables detrás del mismo token.
@Injectable()
export class EmailNotificacionService implements NotificacionSender {
  private readonly logger = new Logger(EmailNotificacionService.name);

  enviar(mensaje: string): string {
    this.logger.log(`[email simulado] ${mensaje}`);
    return `email:${mensaje}`;
  }
}
