# Práctica — Semana 10 (Carga de archivos y logging)

Mini-proyecto integrador de la semana 10: portadas de libros + logging consistente.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana10` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/libros/libros.controller.ts` — validación de archivos
**Propósito:** aceptar solo imágenes chicas, con nombre único en disco.
**Archivos:** `src/libros/libros.controller.ts`
- [ ] TODO 1: nombre único con `randomUUID() + extname(file.originalname)`
- [ ] TODO 2: `limits: { fileSize: TAMANO_MAX_BYTES }`
- [ ] TODO 3: `fileFilter` que solo acepte `MIME_PERMITIDOS`

### 2. `src/prestamos/prestamos.service.ts` — Logger con contexto
**Propósito:** reemplazar `console.log` por el `Logger` de Nest.
**Archivos:** `src/prestamos/prestamos.service.ts`
- [ ] TODO 4: `private readonly logger = new Logger(PrestamosService.name)`
- [ ] TODO 5: loguear la creación del préstamo
- [ ] TODO 6: loguear la devolución

### 3. `src/common/interceptors/logging.interceptor.ts` y `src/main.ts` — interceptor global
**Propósito:** medir y loguear cada request HTTP, sin tocar cada controller.
**Archivos:** `src/common/interceptors/logging.interceptor.ts`, `src/main.ts`
- [ ] TODO 7: `next.handle().pipe(tap(() => logger.log(...)))`
- [ ] TODO 8: `app.useGlobalInterceptors(new LoggingInterceptor())`

Después de terminar:

```
npm run start:dev
curl -X POST -F "file=@portada.png;type=image/png" http://localhost:3000/api/libros/1/portada
```

## Checklist de cierre

- [ ] Mi endpoint de subida valida tipo y tamaño de archivo antes de guardarlo
- [ ] Uso el `Logger` de Nest en vez de `console.log` en el código de negocio
- [ ] Tengo un interceptor de logging global funcionando
