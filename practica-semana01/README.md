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
- [ ] Implementar `paginate<T>` (slice desde `(page-1)*size`)
- [ ] Reemplazar `any` por `Omit<Libro,'id'>`, `Partial<Libro>` y `Pick<Libro,'id'|'titulo'>`
- [ ] `npm run dia1` imprime sin lanzar error

### 2. `src/dia3-libro.ts` — tipado estructural (duck typing)
**Propósito:** ver que una `class` encaja en una `interface`/`type` sin `implements`.
**Archivos:** `src/dia3-libro.ts`
- [ ] Completar los campos de `LibroInterface` y `LibroType`
- [ ] `npm run dia3` imprime ambas asignaciones

### 3. `src/dia4-decorators.ts` — decorators de clase, método y propiedad
**Propósito:** la diferencia clave vs annotations Java: el decorator ejecuta y modifica.
**Archivos:** `src/dia4-decorators.ts`
- [ ] `LogInstancia`: devolver una clase que loguee cada `new`
- [ ] `MedirTiempo`: envolver `descriptor.value` midiendo duración
- [ ] `Timestamp`: `Reflect.defineMetadata('timestamp', ...)`
- [ ] `npm run dia4` imprime `[instancia]`, `[método]` y `Timestamp metadata: presente`

## Checklist de cierre

- [ ] Escribo `paginate<T>` sin mirar
- [ ] Uso `Partial`/`Pick`/`Omit` en un DTO
- [ ] Explico tipado estructural vs nominal
- [ ] Escribo los 3 decorators desde cero
- [ ] Mi `tsconfig.json` tiene `strict: true` + `experimentalDecorators`
