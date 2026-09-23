# Práctica — Semana 7 (Exception Filters y manejo de errores)

Mini-proyecto integrador de la semana 7: respuestas de error consistentes en Biblioteca.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana07` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/libros/libros.service.ts` — excepciones HTTP específicas
**Propósito:** usar la excepción con el código correcto según el caso (tu jerarquía de excepciones HTTP).
**Archivos:** `src/libros/libros.service.ts`
- [ ] TODO 1: `findOne()` lanza `NotFoundException` si no existe
- [ ] TODO 2: `create()` lanza `NotFoundException` si el autor no existe
- [ ] TODO 3: `create()` lanza `ConflictException` si el isbn ya existe

### 2. `src/common/filters/all-exceptions.filter.ts` — filter global
**Propósito:** capturar cualquier excepción no manejada y responder con un formato consistente.
**Archivos:** `src/common/filters/all-exceptions.filter.ts`
- [ ] TODO 4: decorar la clase con `@Catch()`
- [ ] TODO 5: `statusCode` = `exception.getStatus()` si es `HttpException`, si no `500`
- [ ] TODO 6: responder con `{ statusCode, message, error, timestamp, path }`

### 3. `src/common/exceptions/libro-no-disponible.exception.ts` — excepción de dominio
**Propósito:** encapsular una regla de negocio específica en una excepción propia.
**Archivos:** `src/common/exceptions/libro-no-disponible.exception.ts`
- [ ] TODO 7: extender `HttpException`, con `super(mensaje, HttpStatus.CONFLICT)`

### 4. `src/prestamos/prestamos.service.ts` y `src/main.ts` — conectar todo
**Propósito:** usar la excepción de dominio y activar el filter global.
**Archivos:** `src/prestamos/prestamos.service.ts`, `src/main.ts`
- [ ] TODO 8: lanzar `LibroNoDisponibleException` si el libro ya está prestado
- [ ] TODO 9: `app.useGlobalFilters(new AllExceptionsFilter())`

Después de terminar:

```
npm run start:dev
curl http://localhost:3000/api/libros/999
```

Debe devolver 404 con el formato `{ statusCode, message, error, timestamp, path }`.

## Checklist de cierre

- [ ] Uso la excepción HTTP específica correcta según el caso, no genéricas
- [ ] Tengo un `AllExceptionsFilter` global capturando errores no manejados
- [ ] Mi formato de error es consistente en toda la API
- [ ] Creé al menos una excepción de dominio propia
