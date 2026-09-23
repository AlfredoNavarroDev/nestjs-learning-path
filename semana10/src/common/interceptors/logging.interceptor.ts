import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Interceptor global: loguea método, ruta y tiempo de respuesta de cada
// request. Equivalente a un `OncePerRequestFilter` de Spring que mide
// duración con un `Instant.now()` antes/después de `chain.doFilter()`.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    const inicio = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duracionMs = Date.now() - inicio;
        this.logger.log(`${method} ${originalUrl} — ${duracionMs}ms`);
      }),
    );
  }
}
