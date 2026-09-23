import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

// ── TODO 4: decorar la clase con @Catch() (sin argumentos = catch-all) ──
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // ── TODO 5: statusCode = exception.getStatus() si es HttpException,
    // si no HttpStatus.INTERNAL_SERVER_ERROR ───────────────────────
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error ? exception.message : 'Error interno';

    // ── TODO 6: responder con { statusCode, message, error, timestamp, path } ──
    response.status(statusCode).json({ statusCode, message });
  }
}
