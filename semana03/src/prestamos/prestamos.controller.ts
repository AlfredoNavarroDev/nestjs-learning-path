import { Body, Controller, Get, Post } from '@nestjs/common';
import { PrestamosService } from './prestamos.service';
import { RequestContextService } from './request-context.service';
import { Prestamo } from './prestamo.interface';

@Controller('prestamos')
export class PrestamosController {
  constructor(
    private readonly prestamosService: PrestamosService,
    // RequestContextService tiene Scope.REQUEST: cada request HTTP a este
    // controller recibe una instancia nueva (comprobalo en /demo-scope).
    private readonly requestContext: RequestContextService,
  ) {}

  @Get()
  findAll(): Prestamo[] {
    return this.prestamosService.findAll();
  }

  @Post()
  crear(
    @Body() body: { libroId: string; usuario: string },
  ): Prestamo {
    return this.prestamosService.crear(body.libroId, body.usuario);
  }

  @Post('devolver')
  devolver(@Body() body: { libroId: string }): { ok: true } {
    this.prestamosService.devolver(body.libroId);
    return { ok: true };
  }

  // Demuestra Scope.REQUEST: cada llamada da un timestamp de creación distinto
  // (a diferencia de un provider DEFAULT, que reutiliza siempre la misma instancia).
  @Get('demo-scope')
  demoScope(): { timestampInstancia: number } {
    return { timestampInstancia: this.requestContext.getTimestamp() };
  }
}
