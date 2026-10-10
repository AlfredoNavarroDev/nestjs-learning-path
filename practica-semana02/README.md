# Práctica — Semana 2 (Nest CLI, Modules y Controllers)

Mini-proyecto integrador de la semana 2: bootstrapear una app Nest y armar la arquitectura modular + controllers de Biblioteca.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana02` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/main.ts` — bootstrap y config global
**Propósito:** `NestFactory.create` + prefijo + CORS (tu `SpringApplication.run`).
**Archivos:** `src/main.ts`
- [x] Descomentar `app.setGlobalPrefix('api')`
- [x] Descomentar `app.enableCors()`

### 2. `src/libros/libros.module.ts` y `src/autores/autores.module.ts` — módulos de feature
**Propósito:** encapsular cada feature (el `@Module` = tu paquete por feature en Spring).
**Archivos:** `src/libros/libros.module.ts`, `src/autores/autores.module.ts`
- [x] Registrar `LibrosController` en `controllers`
- [x] Registrar `AutoresController` en `controllers`

### 3. `src/app.module.ts` — ensamblar el grafo
**Propósito:** Nest no escanea; el módulo raíz importa los feature modules explícitamente.
**Archivos:** `src/app.module.ts`
- [x] Agregar `imports: [LibrosModule, AutoresModule]`

### 4. `src/libros/libros.controller.ts` — CRUD con decoradores de ruta
**Propósito:** mapear rutas con `@Get/@Post/@Delete` + `@Param/@Query/@Body` (tu `@RestController`).
**Archivos:** `src/libros/libros.controller.ts`
- [x] `findAll`: filtrar por `prestado` si viene el query param
- [x] `findOne`: devolver el libro por `id`
- [x] `create`: crear libro con id nuevo y devolverlo (201)
- [x] `remove`: eliminar por `id` (204)

### 5. `src/autores/autores.controller.ts` — GET de autores
**Propósito:** consolidar `@Get` + `@Param`.
**Archivos:** `src/autores/autores.controller.ts`
- [x] `findAll` devuelve todos los autores
- [x] `findOne` devuelve el autor por `id`

Después de terminar:

```
npm run start:dev
curl http://localhost:3000/api/libros
```

Debe devolver los 3 libros.

## Checklist de cierre

- [x] Explico modular (Nest) vs capas (Spring)
- [x] Cableo 2 módulos de feature al módulo raíz
- [x] Escribo un CRUD con decoradores de ruta
- [x] Sé qué va en `imports`/`controllers`/`providers`/`exports`
- [x] Explico cuándo un módulo es dinámico vs estático
