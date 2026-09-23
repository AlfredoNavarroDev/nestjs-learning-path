// Interfaz pura de TypeScript: no puede inyectarse por tipo (se borra al compilar
// a JS), por eso hace falta un token de inyección (ver notificaciones.constants.ts).
export interface NotificacionSender {
  enviar(mensaje: string): string;
}
