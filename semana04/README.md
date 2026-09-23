# Semana 4 — DTOs, class-validator y Pipes

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana04/`
> Dominio: Biblioteca — blindar la API contra datos malformados antes de que lleguen a la lógica de negocio.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `@RequestBody @Valid CreateLibroDto` | `@Body() dto: CrearLibroDto` + `ValidationPipe` global | en Nest la validación es un Pipe, no una annotation en la firma |
| `@NotNull`/`@Email`/`@Size` (Bean Validation) | `@IsString()`/`@IsEmail()`/`@MinLength()` (`class-validator`) | mismos conceptos, decoradores de otra librería |
| `@JsonIgnoreProperties(ignoreUnknown = false)` | `whitelist: true` + `forbidNonWhitelisted: true` | mismo objetivo: rechazar campos no declarados |
| `ConversionService` (casteo de query params) | `transform: true` en el `ValidationPipe` | Nest lo resuelve en el mismo pipe que valida |
| `@ExceptionHandler(MethodArgumentNotValidException)` | Nest ya devuelve 400 automático con el array de errores | menos boilerplate, formato por defecto ya viene armado |
| Interfaz `Converter<S,T>` para parseo custom | `PipeTransform` custom | mismo rol: transformar/validar un valor antes del controller |

---

## Día 1-2: DTOs y class-validator 🟡

### Teoría
Un DTO es el contrato de lo que entra por HTTP — no tiene por qué ser igual a la Entity que se persiste (llega en la semana 5). `class-validator` valida con decoradores sobre las propiedades de una clase.

### Cómo se compara con Spring Boot
Bean Validation (`jakarta.validation`) y `class-validator` cubren el mismo terreno con decoradores casi 1:1 (`@NotNull`→`@IsNotEmpty`, `@Email`→`@IsEmail`, `@Size`→`@MinLength`/`@MaxLength`). La diferencia real: en Spring la anotación vive en el campo de la Entity o el DTO indistintamente; en Nest **siempre** conviene un DTO separado (clase liviana, sin decoradores de persistencia mezclados).

### Qué construimos
```
CrearLibroDto: titulo, autorId, isbn, anio, prestado?
  @IsString @MinLength(2)   titulo
  @Matches(ISBN_REGEX)      isbn
  @IsInt @Min @Max          anio
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/dto/crear-libro.dto.ts` | DTO de creación con validaciones completas |
| `src/prestamos/dto/solicitante.dto.ts` | DTO anidado (ver Día 5) |

### Cómo probar (salida real)
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"Implementando DDD","autorId":"1","isbn":"978-0321834577","anio":2013}' \
  http://localhost:3000/api/libros
→ HTTP 201
{"titulo":"Implementando DDD","autorId":"1","isbn":"978-0321834577","anio":2013,"prestado":false,"id":"2"}
```

### Regla práctica
- El DTO vive en `dto/`, separado de la interfaz/entity del dominio.
- Cada decorador de `class-validator` es una regla de negocio explícita, no un comentario.

---

## Día 3: ValidationPipe global 🟡

### Teoría
`app.useGlobalPipes(new ValidationPipe({ whitelist, forbidNonWhitelisted, transform }))` en `main.ts` aplica la validación a **todos** los endpoints tipados con un DTO, sin repetir `@UsePipes()` en cada uno.

### Cómo se compara con Spring Boot
Es el equivalente a activar validación global vs poner `@Valid` en cada parámetro. Nest lo centraliza en un solo lugar (`main.ts`), similar a un `@ControllerAdvice` pero para la etapa de validación en vez de excepciones.

### Qué construimos
```
main.ts: ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })
```

### Cómo probar (salida real — campo extra + validación fallida)
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"X","autorId":"1","isbn":"978-0321834577","anio":2013,"campoRaro":1}' \
  http://localhost:3000/api/libros
→ HTTP 400
{"message":["property campoRaro should not exist","titulo must be longer than or equal to 2 characters"],"error":"Bad Request","statusCode":400}
```

### Regla práctica
- `whitelist` sin `forbidNonWhitelisted` **descarta** silenciosamente lo que sobra; con `forbidNonWhitelisted` además devuelve 400. Preferí siempre la segunda combinación en una API real.

---

## Día 4: Pipes personalizados 🟡

### Teoría
Un Pipe implementa `PipeTransform` con un método `transform(value, metadata)`. Nest ya trae `ParseIntPipe`/`ParseUUIDPipe`; uno propio sirve para reglas de negocio específicas sobre un solo valor (no un DTO completo).

### Cómo se compara con Spring Boot
Equivalente a un `Converter<String, T>` o `HandlerMethodArgumentResolver` custom — código que intercepta un parámetro de ruta antes de que llegue al controller.

### Qué construimos
```
IsbnValidationPipe implements PipeTransform<string, string>
  → aplicado en @Param('isbn', IsbnValidationPipe)
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/common/pipes/isbn-validation.pipe.ts` | Pipe custom con regex de ISBN |

### Cómo probar (salida real)
```
curl "http://localhost:3000/api/libros/isbn/978-0132350884"
→ 200 {"id":"1","titulo":"Clean Code",...}

curl "http://localhost:3000/api/libros/isbn/no-es-isbn"
→ 400 {"message":"ISBN inválido: \"no-es-isbn\"","error":"Bad Request","statusCode":400}
```

### Regla práctica
- Un Pipe custom se justifica cuando la regla es sobre **un valor puntual** (`@Param`/`@Query`); si la regla involucra varios campos relacionados, va en el DTO con `class-validator`.

---

## Día 5: Validaciones anidadas y condicionales 🟡

### Teoría
`@ValidateNested()` + `@Type(() => Clase)` (de `class-transformer`) valida un objeto anidado con las reglas de su propio DTO. `@ValidateIf()` aplica una regla solo si se cumple una condición sobre otro campo.

### Cómo se compara con Spring Boot
Bean Validation resuelve lo anidado con `@Valid` recursivo en el campo (`@Valid private SolicitanteDto solicitante`). La diferencia: en Nest hace falta `@Type()` explícito, porque `class-transformer` necesita saber a qué clase instanciar el JSON plano — sin eso, `@ValidateNested` no tiene sobre qué validar.

### Qué construimos
```
CrearPrestamoDto
 ├─ libroId: string
 ├─ solicitante: SolicitanteDto (@ValidateNested + @Type)
 │    ├─ nombre: string
 │    └─ email: string (@IsEmail)
 └─ notas?: string (@ValidateIf)
```

### Cómo probar (salida real)
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"libroId":"1","solicitante":{"nombre":"Ana Torres","email":"ana@mail.com"}}' \
  http://localhost:3000/api/prestamos
→ 201 {"id":"1","libroId":"1","usuario":"Ana Torres","fecha":"..."}

curl -X POST -H "Content-Type: application/json" \
  -d '{"libroId":"1","solicitante":{"nombre":"Ana","email":"no-es-email"}}' \
  http://localhost:3000/api/prestamos
→ 400 {"message":["solicitante.email must be an email"],"error":"Bad Request","statusCode":400}
```

### Regla práctica
- Si olvidás `@Type()`, `@ValidateNested()` no valida nada (el objeto anidado llega como `Object` plano, sin instancia de la clase decorada).

---

## Día 6-7: Repaso + DTOs completos del proyecto 🟡

Todos los DTOs del recorte de dominio usado en esta ruta (`Libro`, `Prestamo` con `Solicitante` anidado) quedan con validaciones robustas y probados contra requests reales, incluyendo `PartialType` para el `PATCH` de libros.

---

## Checklist de cierre

- [ ] Entiendo por qué un DTO no debería ser igual a la Entity
- [ ] Mi `ValidationPipe` global tiene `whitelist` y `transform` activados
- [ ] Escribí un Pipe personalizado sin copiar de la documentación
- [ ] Sé validar objetos anidados dentro de un DTO
- [ ] Los DTOs del proyecto rechazan correctamente datos inválidos
