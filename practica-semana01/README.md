# Práctica — Semana 1 (TypeScript esencial para Nest)

Mini-proyecto integrador de la semana 1: tipos avanzados, tipado estructural y decorators.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana01` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npx tsc
```

## Orden sugerido

### 1. `src/dia1-tipos.ts` — generics y utility types
**Propósito:** dominar `paginate<T>` y los utility types `Omit`/`Partial`/`Pick` (tu reemplazo de Lombok/MapStruct).
**Archivos:** `src/dia1-tipos.ts`
- [x] Implementar `paginate<T>` (slice desde `(page-1)*size`)
- [x] Reemplazar `any` por `Omit<Libro,'id'>`, `Partial<Libro>` y `Pick<Libro,'id'|'titulo'>`
- [x] `npm run dia1` imprime sin lanzar error

### 2. `src/dia3-libro.ts` — tipado estructural (duck typing)
**Propósito:** ver que una `class` encaja en una `interface`/`type` sin `implements`.
**Archivos:** `src/dia3-libro.ts`
- [x] Completar los campos de `LibroInterface` y `LibroType`
- [x] `npm run dia3` imprime ambas asignaciones

### 3. `src/dia4-decorators.ts` — decorators de clase, método y propiedad
**Propósito:** la diferencia clave vs annotations Java: el decorator ejecuta y modifica.
**Archivos:** `src/dia4-decorators.ts`
- [x] `LogInstancia`: devolver una clase que loguee cada `new`
- [x] `MedirTiempo`: envolver `descriptor.value` midiendo duración
- [x] `Timestamp`: `Reflect.defineMetadata('timestamp', ...)`
- [x] `npm run dia4` imprime `[instancia]`, `[método]` y `Timestamp metadata: presente`

## Checklist de cierre

- [x] Escribo `paginate<T>` sin mirar
- [x] Uso `Partial`/`Pick`/`Omit` en un DTO
- [x] Explico tipado estructural vs nominal
- [x] Escribo los 3 decorators desde cero
- [x] Mi `tsconfig.json` tiene `strict: true` + `experimentalDecorators`
