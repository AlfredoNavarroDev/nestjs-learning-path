# Práctica — Semana 4 (DTOs, class-validator y Pipes)

Mini-proyecto integrador de la semana 4: blindar la API de Biblioteca contra datos malformados.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana04` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/main.ts` — ValidationPipe global
**Propósito:** activar validación automática en toda la app (tu `@Valid` global).
**Archivos:** `src/main.ts`
- [ ] TODO 1: `app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))`

### 2. `src/libros/dto/crear-libro.dto.ts` — decoradores de class-validator
**Propósito:** declarar las reglas de validación del DTO principal.
**Archivos:** `src/libros/dto/crear-libro.dto.ts`
- [ ] TODO 2: `@IsString @MinLength(2)` en `titulo`, `@IsString` en `autorId`, `@Matches(ISBN_REGEX)` en `isbn`, `@IsInt @Min(1450) @Max(añoActual)` en `anio`, `@IsOptional @IsBoolean` en `prestado`

### 3. `src/common/pipes/isbn-validation.pipe.ts` — Pipe personalizado
**Propósito:** validar un parámetro de ruta puntual con una regla propia (tu `Converter<String,T>`).
**Archivos:** `src/common/pipes/isbn-validation.pipe.ts`
- [ ] TODO 3: si `value` no matchea `ISBN_REGEX`, lanzar `BadRequestException`

### 4. `src/prestamos/dto/solicitante.dto.ts` y `crear-prestamo.dto.ts` — validación anidada
**Propósito:** validar un objeto anidado dentro de otro DTO.
**Archivos:** `src/prestamos/dto/solicitante.dto.ts`, `src/prestamos/dto/crear-prestamo.dto.ts`
- [ ] TODO 5: `@IsString @MinLength(3)` en `nombre`, `@IsEmail()` en `email`
- [ ] TODO 4: `@ValidateNested()` + `@Type(() => SolicitanteDto)` en `solicitante`

Después de terminar:

```
npm run start:dev
curl -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"X","autorId":"1","isbn":"invalido","anio":2013,"campoRaro":1}' \
  http://localhost:3000/api/libros
```

Debe devolver 400 con los errores de validación (campo extra + ISBN inválido).

## Checklist de cierre

- [ ] Entiendo por qué un DTO no debería ser igual a la Entity
- [ ] Mi `ValidationPipe` global tiene `whitelist` y `transform` activados
- [ ] Escribí un Pipe personalizado sin copiar de la documentación
- [ ] Sé validar objetos anidados dentro de un DTO
