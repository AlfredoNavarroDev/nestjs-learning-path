# Semana 1 — TypeScript esencial para Nest

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `Semana 1/`
> Dominio: los fundamentos de TypeScript que Nest explota a fondo (decorators, generics, utility types, tipado estructural).

---

## Mapa mental: qué cambia respecto a Java

| Java | TypeScript | Diferencia clave |
|---|---|---|
| Tipado **nominal** (el nombre manda) | Tipado **estructural** (la forma manda) | una clase encaja en una interface sin `implements` |
| Annotations (`@Entity`, `@Override`) | Decorators (`@Injectable`, `@Get`) | el decorator **ejecuta** y puede modificar; la annotation solo es metadata |
| Generics `<T>` con type erasure | Generics `<T>` con mejor inferencia | misma sintaxis, menos boilerplate |
| No hay utility types nativos | `Partial<T>`, `Pick<T>`, `Omit<T>` | transformar DTOs inline, sin Lombok/MapStruct |
| Compilador estricto por defecto | `strict: true` es opt-in | hay que activarlo |
| Reflection (`java.lang.reflect`) | `reflect-metadata` | mismo rol: metadata en runtime que Nest usa para DI |

---

## Día 1: Tipos avanzados — union, generics, utility types 🟡

### Teoría
Union types (`string | number`), generics (`<T>`), utility types (`Partial`, `Pick`, `Omit`, `Readonly`).

### Cómo se compara con Java
- **Union types:** no existen en Java. Lo más cercano es un `enum` o las *sealed interfaces* de Java 17+. En TS es nativo y ubicuo.
- **Generics:** misma sintaxis `<T>`, pero Java borra el tipo en runtime (type erasure) y TS conserva mejor la inferencia.
- **Utility types:** Java no tiene. El equivalente mental es Lombok (`@Builder`) o MapStruct para transformar DTOs; en TS se hace inline.

### Qué construimos
```
paginate<T>(items, page, size)  →  Paginado<T>
Libro  --Omit-->    LibroCrear      (sin id)
       --Partial--> LibroEditar     (todo opcional)
       --Pick-->    LibroIdTitulo   (solo id + titulo)
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/dia1-tipos.ts` | generics + utility types + union literal |

### Cómo probar
```
npm run dia1
```
Salida real:
```
Página 1: [{"id":"1","titulo":"Clean Code","autor":"Martin","prestado":false}]
LibroCrear (sin id): {"titulo":"Refactoring","autor":"Fowler","prestado":false}
Estado (union literal): prestado
```

### Regla práctica
- Para DTOs de entrada usá `Omit`/`Pick`/`Partial` en vez de duplicar interfaces.
- Un union type de strings literales es tu `enum` de Java con menos ceremony.

---

## Día 3: interface vs type vs class 🟡

### Teoría
Tres formas de modelar un `Libro`; cuál conviene en DTO vs entity vs contrato de servicio.

### Cómo se compara con Java
- **Java es nominal:** si `LibroClass` no declara `implements LibroInterface`, no es un `LibroInterface`.
- **TypeScript es estructural (duck typing):** si la forma coincide, es compatible. `new LibroClass(...)` encaja en `LibroInterface` **sin** `implements`.

### Qué construimos
```
LibroInterface  (interface)
LibroType       (type)
LibroClass      (class)
  └─ asignable a interface Y a type, sin `implements`
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/dia3-libro.ts` | tipado estructural en acción |

### Cómo probar
```
npm run dia3
```
Salida real:
```
Class como Interface: {"titulo":"Clean Code","autor":"Martin"}
Class como Type: {"titulo":"DDD","autor":"Evans"}
```

### Regla práctica
- DTOs/contratos → `interface` (extension, merge de declaraciones).
- Uniones/transformaciones → `type`.
- Instancias con lógica → `class`.
- No necesitás `implements` para que algo sea compatible.

---

## Día 4: Decorators desde cero 🟡

### Teoría
Un decorator es una función que recibe la clase/método/propiedad y puede **modificarla** en tiempo de definición. `reflect-metadata` adjunta metadata que Nest lee para resolver la inyección de dependencias.

### Cómo se compara con Java
Esta es la diferencia **más importante** de la semana:
- Una annotation Java (`@Entity`, `@Override`) es solo metadata: no ejecuta ni cambia nada por sí sola (necesita un annotation processor o AOP aparte).
- Un decorator TS **ejecuta**: recibe el constructor/descriptor y puede reemplazarlo. Nest usa esto para registrar controllers y providers en runtime.

### Qué construimos
```
@LogInstancia  → clase:      loguea cada `new`
@MedirTiempo   → método:     mide duración
@Timestamp     → propiedad:  adjunta metadata (reflect-metadata)
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/dia4-decorators.ts` | 3 decorators propios (clase, método, propiedad) |

### Cómo probar
```
npm run dia4
```
Salida real:
```
[instancia] Libro creado
[método] resumen tardó 0ms
Resumen: "Clean Code"
Timestamp metadata: presente
```

### Regla práctica
- Un decorator es una función que **envuelve**; una annotation no envuelve nada.
- `experimentalDecorators` + `emitDecoratorMetadata` son los flags que hacen que Nest "vea" tus clases.

---

## Día 5: tsconfig.json y compilación estricta 🟡

### Teoría
`strict: true` y sus sub-flags, más `experimentalDecorators` y `emitDecoratorMetadata`.

### Cómo se compara con Java
Java es estricto por defecto; TS es permisivo por defecto. `strict: true` te devuelve la seguridad que en Java das por sentada. Los dos flags de decorators no tienen par en Java estándar: son la puerta a la reflexión que Nest usa.

### Qué construimos
`tsconfig.json` con `strict: true` + decorators (ya activo en este proyecto).

### Cómo probar
```
npx tsc --noEmit
```
Compila sin errores. Probá romper un tipo a propósito (ej. `const x: number = "hola"`) y mirá el error.

### Regla práctica
- Nunca arranques un proyecto Nest sin `strict: true`.
- `emitDecoratorMetadata` es lo que hace funcionar la DI de Nest.

---

## Día 6-7: Repaso + ejercicio integrador 🟡

Repasar generics, decorators y utility types. El integrador son los 3 decorators propios de `src/dia4-decorators.ts`: escribirlos de cero sin copiar, cada uno con una responsabilidad (logging, medición, timestamp).

---

## Checklist de cierre

- [ ] Escribo `paginate<T>` genérica sin mirar
- [ ] Sé cuándo usar `Partial`/`Pick`/`Omit` en un DTO real
- [ ] Explico la diferencia entre tipado estructural (TS) y nominal (Java)
- [ ] Escribo un decorator de clase, método y propiedad desde cero
- [ ] Explico por qué un decorator TS ejecuta y una annotation Java no
- [ ] Mi `tsconfig.json` tiene `strict: true` + `experimentalDecorators`
