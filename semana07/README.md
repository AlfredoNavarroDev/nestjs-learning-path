# Semana 7 — Exception Filters y manejo de errores

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana07/`
> Dominio: Biblioteca — respuestas de error consistentes en toda la API.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `throw new ResponseStatusException(HttpStatus.NOT_FOUND, ...)` | `throw new NotFoundException(...)` | mismo rol, clase con nombre semántico en vez de status + mensaje sueltos |
| `@ControllerAdvice` + `@ExceptionHandler(X.class)` | `@Catch(X)` + `implements ExceptionFilter` | mismo patrón: interceptar por tipo de excepción, centralizado |
| `@ExceptionHandler(Exception.class)` (catch-all) | `@Catch()` sin argumentos | catch-all para cualquier excepción no manejada antes |
| Excepción custom `extends RuntimeException` + mapeo manual a status | Excepción custom `extends HttpException` | en Nest el status ya viaja en la excepción, no hace falta un mapeo aparte |
| `ErrorResponse` (record propio, records de Java 17+) | objeto plano `{ statusCode, message, error, timestamp, path }` | mismo objetivo: forma de error consistente |

---

## Día 1-2: Excepciones HTTP built-in 🟡

### Teoría
`HttpException` es la base; Nest trae subclases con nombre semántico: `NotFoundException` (404), `BadRequestException` (400), `ConflictException` (409), `UnauthorizedException` (401). Elegir la correcta es parte de diseñar bien la API, no un detalle.

### Cómo se compara con Spring Boot
Spring no tiene una jerarquía de excepciones HTTP tan poblada por defecto — se suele armar una jerarquía propia o usar `ResponseStatusException` con el status como parámetro. Nest ya trae el catálogo común listo para usar.

### Qué construimos
```
LibrosService.findOne()  → NotFoundException (404) si no existe
LibrosService.create()   → NotFoundException (404) si el autor no existe
                          → ConflictException (409) si el isbn ya existe
```

### Cómo probar (salida real)
```
curl http://localhost:3000/api/libros/999
→ 404 {"statusCode":404,"message":"Libro 999 no existe",...}

curl -X POST -d '{"titulo":"Otro","isbn":"978-0321125217","autorId":"1"}' .../api/libros
→ 409 {"statusCode":409,"message":"Ya existe un libro con isbn 978-0321125217",...}
```

### Regla práctica
- "No encontrado" es siempre 404, nunca 400. "Conflicto de estado" (duplicado, recurso ocupado) es 409, no 400.

---

## Día 3: Exception Filters personalizados 🟡

### Teoría
Un filter implementa `ExceptionFilter` con el método `catch(exception, host)`. `@Catch()` sin argumentos lo convierte en catch-all; `@Catch(TipoEspecifico)` lo limita a un tipo. `app.useGlobalFilters()` lo aplica a toda la app.

### Cómo se compara con Spring Boot
Mismo patrón que `@ControllerAdvice` + `@ExceptionHandler`, pero mientras Spring resuelve el filtro correcto por reflexión sobre el tipo del parámetro del método, en Nest es explícito con `@Catch(Tipo)`.

### Qué construimos
```
AllExceptionsFilter @Catch() implements ExceptionFilter
  → captura HttpException Y errores no controlados (500)
  → responde siempre con el mismo formato JSON
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/common/filters/all-exceptions.filter.ts` | filter global catch-all |
| `src/main.ts` | `app.useGlobalFilters(new AllExceptionsFilter())` |

### Cómo probar (salida real — ruta inexistente, error no controlado por ningún filter específico)
```
curl http://localhost:3000/api/no-existe
→ 404 {"statusCode":404,"message":"Cannot GET /api/no-existe","error":"NOT_FOUND",...}
```

### Regla práctica
- `useGlobalFilters()` va antes de `listen()` en `main.ts`. Si preferís por-módulo, existe `@UseFilters()` a nivel de controller.

---

## Día 4: Formato de error estándar 🟡

### Teoría
Un formato consistente (`statusCode`, `message`, `error`, `timestamp`, `path`) hace que el cliente (frontend, otro servicio) pueda manejar errores sin parsear casos especiales por endpoint.

### Cómo se compara con Spring Boot
Equivalente a definir un `record ErrorResponse(int status, String message, String error, Instant timestamp, String path)` y devolverlo siempre desde el `@ControllerAdvice`.

### Qué construimos
```
{ statusCode, message, error, timestamp, path }
```
aplicado a **todos** los endpoints de Biblioteca (no solo a uno).

### Regla práctica
- `message` puede ser string (error simple) o array (errores de `class-validator`, semana 4) — el filter maneja ambos casos sin romperse.

---

## Día 5: Excepciones de dominio propias 🟡

### Teoría
Crear una excepción propia (`extends HttpException`) se justifica cuando el caso es específico del negocio y el mensaje/código no cambia según el llamador — encapsula la regla en un solo lugar.

### Cómo se compara con Spring Boot
Igual que crear `class LibroNoDisponibleException extends ResponseStatusException` (o una `RuntimeException` con un `@ResponseStatus` propio) — la ventaja es no repetir el mismo `throw new ConflictException("mensaje largo")` en cada lugar que dispara el mismo caso.

### Qué construimos
```
LibroNoDisponibleException extends HttpException
  → status 409, mensaje armado con el id del libro
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/common/exceptions/libro-no-disponible.exception.ts` | excepción de dominio |

### Cómo probar (salida real)
```
curl -X POST -d '{"libroId":"1"}' http://localhost:3000/api/prestamos
→ 201 {"libroId":"1","prestado":true}

curl -X POST -d '{"libroId":"1"}' http://localhost:3000/api/prestamos   # de nuevo
→ 409 {"statusCode":409,"message":"El libro 1 no está disponible para préstamo",...}
```

### Regla práctica
- Si vas a lanzar el mismo `ConflictException("mensaje largo")` desde más de un lugar, es momento de crear la excepción de dominio.

---

## Día 6-7: Repaso + manejo de errores completo 🟡

Cada endpoint de Biblioteca (libros, autores, préstamos) devuelve el código y formato correcto para sus casos de fallo: no encontrado (404), duplicado (409), sin stock (409, excepción de dominio), y cualquier error no previsto cae en el filter global con 500.

---

## Checklist de cierre

- [ ] Uso la excepción HTTP específica correcta según el caso, no genéricas
- [ ] Tengo un `AllExceptionsFilter` global capturando errores no manejados
- [ ] Mi formato de error es consistente en toda la API
- [ ] Creé al menos una excepción de dominio propia
