import { Injectable, Logger } from '@nestjs/common';
import { NotificacionSender } from './notificacion-sender.interface';

@Injectable()
export class ConsolaNotificacionService implements NotificacionSender {
  private readonly logger = new Logger(ConsolaNotificacionService.name);

  enviar(mensaje: string): string {
    this.logger.log(`[consola] ${mensaje}`);
    return `consola:${mensaje}`;
  }
}
