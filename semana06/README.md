# Semana 6 — TypeORM: relaciones y Query Builder

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana06/`
> Dominio: Biblioteca — relaciones reales entre Libro, Autor, Usuario y Préstamo.
> ⚠️ Requiere PostgreSQL corriendo. Se verificó con `npm run build` (compila limpio); las salidas de "Cómo probar" son las esperadas — no se ejecutó contra una base de datos real en este entorno.

---

## Mapa mental: qué cambia respecto a Spring Boot (Spring Data JPA)

| Spring Data JPA | TypeORM | Diferencia clave |
|---|---|---|
| `@OneToMany(mappedBy = "libro")` / `@ManyToOne` | `@OneToMany(() => Prestamo, p => p.libro)` / `@ManyToOne()` | en vez de un string (`mappedBy`), TypeORM usa una función que apunta al campo inverso — el compilador la revisa |
| `@ManyToMany` + `@JoinTable` en un lado, `mappedBy` en el otro | igual: `@ManyToMany` + `@JoinTable()` en el dueño, `@ManyToMany` simple en el inverso | mismo patrón exacto |
| `FetchType.LAZY` (default en `@OneToMany`/`@ManyToMany`) | sin `eager: true` (default) — hay que pedir `relations: [...]` | ambos son lazy por defecto; Nest no tiene proxies, así que "lazy" significa "no la traigo si no la pido" |
| `EntityManager.createQuery()` (JPQL) | `Repository.createQueryBuilder()` | el Query Builder de TypeORM es más parecido a SQL con azúcar que a JPQL |
| `@Query("... JOIN FETCH ...")` para evitar N+1 | `.leftJoinAndSelect()` en el Query Builder | mismo objetivo: un solo `SELECT` con el join, no N+1 queries |

---

## Día 1-2: Relaciones uno-a-muchos 🟡

### Teoría
`@OneToMany()` va del lado "uno" (ej. `Usuario.prestamos`), `@ManyToOne()` del lado "muchos" (ej. `Prestamo.usuario`), y `@JoinColumn()` marca en cuál tabla vive la foreign key (siempre en el lado `@ManyToOne`).

### Cómo se compara con Spring Boot
En JPA, `mappedBy` es un string con el nombre del campo inverso (frágil ante refactors); en TypeORM es una función `(entidad) => entidad.campo`, que el compilador de TypeScript sí revisa si renombrás el campo.

### Qué construimos
```
Usuario (1) ──OneToMany──> (N) Prestamo
Libro   (1) ──OneToMany──> (N) Prestamo
Prestamo: @ManyToOne libro (@JoinColumn 'libro_id'), @ManyToOne usuario (@JoinColumn 'usuario_id')
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/usuarios/usuario.entity.ts` | lado `OneToMany` |
| `src/prestamos/prestamo.entity.ts` | lado `ManyToOne` con `@JoinColumn` |

### Regla práctica
- La FK siempre vive en el lado `@ManyToOne`. Si no ponés `@JoinColumn`, TypeORM igual la crea, pero con un nombre autogenerado menos legible.

---

## Día 3: Relaciones muchos-a-muchos 🟡

### Teoría
`@ManyToMany()` en los dos lados; `@JoinTable()` solo en el lado "dueño" de la relación (el que TypeORM usa para crear/gestionar la tabla intermedia).

### Cómo se compara con Spring Boot
Idéntico patrón conceptual. La tabla intermedia se llama distinto por convención (`libros_autores_autores` en TypeORM vs algo como `libro_autor` si la nombrás vos en JPA con `@JoinTable(name = ...)`) — en ambos casos podés nombrarla explícito si no te gusta el default.

### Qué construimos
```
Libro (N) ──ManyToMany + @JoinTable──> (N) Autor
Autor (N) ──ManyToMany (inverso)────> (N) Libro
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/libro.entity.ts` | lado dueño (`@JoinTable()`) |
| `src/autores/autor.entity.ts` | lado inverso |

### Regla práctica
- Si ponés `@JoinTable()` en los dos lados (o en ninguno), TypeORM tira error al arrancar. Elegí un solo dueño.

---

## Día 4: Query Builder básico 🟡

### Teoría
`createQueryBuilder(alias)` + `.leftJoinAndSelect()` + `.where()`/`.andWhere()` arman una query SQL con control fino — útil cuando el repository simple (`find()`) no puede expresar el join o el filtro que necesitás.

### Cómo se compara con Spring Boot
Es el rol de `@Query("SELECT l FROM Libro l JOIN FETCH l.autores")` en JPQL, pero con una API fluida en vez de un string de query embebido.

### Qué construimos
```
LibrosService.findAllConAutores()
  → createQueryBuilder('libro').leftJoinAndSelect('libro.autores', 'autor').getMany()
```

### Cómo probar (esperado — requiere Postgres)
```
curl http://localhost:3000/api/libros
→ [{"id":"...","titulo":"Clean Code",...,"autores":[{"id":"...","nombre":"Robert Martin",...}]}]
```

### Regla práctica
- Si necesitás el repository simple (`find()`) para casos sencillos y Query Builder solo para los joins/filtros complejos, está bien mezclarlos en el mismo service.

---

## Día 5: Filtros dinámicos y agregaciones 🟡

### Teoría
Construir la query agregando `.andWhere()` condicionalmente según qué filtros llegaron — nunca concatenando el valor del usuario directo en el string SQL (siempre con parámetros nombrados, `:param`).

### Cómo se compara con Spring Boot
Equivalente a usar `Specification<T>` o `Criteria API` para queries con filtros opcionales combinables, en vez de escribir un método por cada combinación posible de filtros.

### Qué construimos
```
GET /libros/buscar?titulo=clean&autorId=<uuid>&disponible=true
  → LibrosService.buscar({ titulo, autorId, disponible })
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/libros.service.ts` | `buscar()` con Query Builder y filtros opcionales |
| `src/libros/libros.controller.ts` | endpoint `GET /libros/buscar` |

### Regla práctica
- Siempre parámetros nombrados (`:titulo`) en `andWhere()`, nunca template strings con el valor del usuario — es la forma en que TypeORM previene SQL injection en el Query Builder.

---

## Día 6-7: Repaso + módulo de préstamos completo 🟡

`PrestamosService.crear()` valida que el libro exista (`NotFoundException`, adelanto de la semana 7), crea el préstamo y marca el libro como prestado; `devolver()` revierte el flag. El endpoint de búsqueda combina título + autor + disponibilidad en una sola query.

---

## Checklist de cierre

- [ ] Puedo modelar una relación uno-a-muchos y muchos-a-muchos sin buscar sintaxis
- [ ] Entiendo cuándo una relación debería ser eager y cuándo explícita (`relations: [...]`)
- [ ] Sé cuándo el repository simple no alcanza y necesito Query Builder
- [ ] Construí un endpoint de búsqueda con filtros combinables reales
