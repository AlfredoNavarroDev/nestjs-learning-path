import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// @Catch() sin argumentos = captura cualquier excepción no manejada por un
// filter más específico. Formato de error consistente en toda la API.
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

    const message =
      respuestaExcepcion && typeof respuestaExcepcion === 'object'
        ? (respuestaExcepcion as { message?: unknown }).message
        : exception instanceof Error
          ? exception.message
          : 'Error interno';

    if (statusCode >= 500) {
      this.logger.error(exception);
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error: HttpStatus[statusCode] ?? 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
