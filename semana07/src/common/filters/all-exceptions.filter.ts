import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch() sin argumentos = captura CUALQUIER excepción no manejada por un
// filter más específico. Equivalente a un @ControllerAdvice con
// @ExceptionHandler(Exception.class) como catch-all.
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const respuestaExcepcion =
      exception instanceof HttpException ? exception.getResponse() : null;

    // Si el error viene de ValidationPipe, `getResponse()` ya es un array de
    // mensajes; si no, usamos el mensaje de la excepción o uno genérico.
    const message =
      respuestaExcepcion && typeof respuestaExcepcion === 'object'
        ? (respuestaExcepcion as { message?: unknown }).message
        : exception instanceof Error
          ? exception.message
          : 'Error interno';

    if (statusCode >= 500) {
      this.logger.error(exception);
    }

    // Formato de error estándar: statusCode, message, error, timestamp, path.
    response.status(statusCode).json({
      statusCode,
      message,
      error: HttpStatus[statusCode] ?? 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
