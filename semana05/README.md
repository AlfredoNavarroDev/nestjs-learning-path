# Semana 5 — TypeORM: Entities y Repository

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana05/`
> Dominio: Biblioteca — persistencia real en PostgreSQL con TypeORM.
> ⚠️ Este proyecto **requiere PostgreSQL corriendo** (`.env.example` con las variables). El código se compiló y verificó (`npm run build`) en este entorno, pero **no se ejecutó contra una base de datos real** — las salidas de "Cómo probar" son las esperadas, documentadas a partir del comportamiento conocido de TypeORM/Nest, no capturas de una corrida real.

---

## Mapa mental: qué cambia respecto a Spring Boot (Spring Data JPA)

| Spring Data JPA | TypeORM | Diferencia clave |
|---|---|---|
| `@Entity` + `@Id` + `@GeneratedValue` | `@Entity()` + `@PrimaryGeneratedColumn()` | mismo rol, un decorador en vez de dos |
| `@Column(length = 150)` | `@Column({ type: 'varchar', length: 150 })` | TypeORM pide el `type` explícito más seguido |
| `JpaRepository<Autor, UUID>` (interfaz, Spring genera la impl.) | `Repository<Autor>` inyectado con `@InjectRepository()` | Nest no genera una interfaz nueva por entity: siempre es el mismo `Repository<T>` genérico |
| `spring.jpa.hibernate.ddl-auto=update` | `synchronize: true` | ambos son peligrosos fuera de desarrollo local |
| Flyway (`V1__xxx.sql`) | Migraciones TypeORM (`.ts`, generadas o a mano) | mismo rol; TypeORM las escribe en el mismo lenguaje del proyecto |
| `save()` hace `INSERT` o `UPDATE` según tenga `@Id` | igual: `repo.save()` decide INSERT/UPDATE | idéntico comportamiento |
| `entityManager.createQuery()` (JPQL) | `Repository.update()` / Query Builder (semana 6) | update() de TypeORM es más directo: no trae la entidad primero |

---

## Día 1-2: Entities y decoradores de columna 🟡

### Teoría
`@Entity()` marca la clase como tabla; `@PrimaryGeneratedColumn()` la clave primaria; `@Column()` cada columna, con opciones (`type`, `nullable`, `unique`, `default`).

### Cómo se compara con Spring Boot
Mapping casi 1:1 con JPA/Hibernate. La diferencia notable: Hibernate infiere el tipo de columna SQL desde el tipo de campo Java; TypeORM lo hace también, pero es más común (y más seguro) declararlo explícito en `@Column({ type: ... })`, sobre todo para `varchar` con longitud.

### Qué construimos
```
Autor   { id (uuid), nombre, nacionalidad? }
Libro   { id (uuid), titulo, isbn (unique), anio, prestado, autorId }
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/autores/autor.entity.ts` | Entity con columnas y restricciones |
| `src/libros/libro.entity.ts` | Entity con `isbn` único y `autorId` (FK simple, sin relación formal todavía) |

### Cómo probar (esperado — requiere Postgres)
```
npm run start:dev
curl -X POST -H "Content-Type: application/json" \
  -d '{"nombre":"Robert Martin","nacionalidad":"EE.UU."}' \
  http://localhost:3000/api/autores
→ 201 {"id":"<uuid>","nombre":"Robert Martin","nacionalidad":"EE.UU."}
```

### Regla práctica
- `unique: true` en `isbn` es una restricción de base de datos real, no solo una validación de `class-validator` (semana 4) — las dos capas se complementan.

---

## Día 3: `TypeOrmModule.forFeature()` y Repository inyectado 🟡

### Teoría
`TypeOrmModule.forRoot()` configura la conexión una sola vez (módulo raíz); `forFeature([Entity])` registra qué entities usa cada módulo de feature. `@InjectRepository(Entity)` inyecta el `Repository<Entity>` ya tipado.

### Cómo se compara con Spring Boot
Spring resuelve esto con una interfaz `JpaRepository<Autor, UUID>` que ni siquiera implementás (Spring genera el proxy). En Nest **no hay generación de código**: siempre inyectás el mismo `Repository<T>` genérico, y las queries "derivadas" (`findByNombre`, etc.) se escriben a mano con sus métodos (`find({ where: { nombre } })`) en vez de nombrarlas en una interfaz.

### Qué construimos
```
AutoresModule → imports: [TypeOrmModule.forFeature([Autor])]
AutoresService → @InjectRepository(Autor) autoresRepo: Repository<Autor>
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/autores/autores.module.ts` | `forFeature([Autor])` |
| `src/autores/autores.service.ts` | reemplaza el array en memoria por el repository real |

### Regla práctica
- Sin `forFeature([Entity])` en el módulo, `@InjectRepository(Entity)` falla en el bootstrap con un error de resolución de dependencias.

---

## Día 4: Migraciones 🟡

### Teoría
`synchronize: true` hace que TypeORM recree el schema automáticamente a partir de las entities — cómodo en desarrollo, peligroso (o directamente prohibido) en cualquier otro entorno, porque puede borrar datos. Las migraciones son scripts versionados y reproducibles.

### Cómo se compara con Spring Boot
Mismo problema y misma solución que `ddl-auto=update` vs Flyway. La diferencia de forma: una migración de TypeORM es una clase TypeScript con `up()`/`down()`, no un `.sql` plano — se integra con el resto del código y se puede tipar.

### Qué construimos
```
src/data-source.ts            → DataSource usado por el CLI de TypeORM
src/migrations/*.ts           → CreateAutoresYLibros: crea las 2 tablas
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/data-source.ts` | configuración para `migration:generate`/`migration:run` |
| `src/migrations/1700000000000-CreateAutoresYLibros.ts` | primera migración (tablas `autores` y `libros`) |

### Cómo correrla (requiere Postgres)
```
npm run migration:run
```

### Regla práctica
- `synchronize` y migraciones **no conviven** en el mismo flujo: si vas a usar migraciones, `synchronize: false` desde el día uno (ya está así en este proyecto).

---

## Día 5: Operaciones CRUD con Repository 🟡

### Teoría
`find()`/`findOneBy()` para lectura, `create()` + `save()` para insertar (arma la instancia en memoria y después persiste), `update()` para un `UPDATE` directo sin traer la fila primero, `delete()` para eliminar por criterio.

### Cómo se compara con Spring Boot
`save()` se comporta igual en ambos: hace `INSERT` si no hay id, `UPDATE` si ya existe. La diferencia es `update()`: en JPA normalmente se hace `findById` + modificar + `save` (dirty checking); TypeORM ofrece `update()` como un `UPDATE ... WHERE` directo, más eficiente cuando no necesitás la entidad completa después.

### Qué construimos
```
LibrosService.create()  → repo.create(dto) + repo.save()
LibrosService.update()  → repo.update({ id }, data) + findOne()
LibrosService.remove()  → repo.delete({ id })
```

### Cómo probar (esperado — requiere Postgres)
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"Clean Code","isbn":"978-0132350884","anio":2008,"prestado":false,"autorId":"<uuid-autor>"}' \
  http://localhost:3000/api/libros
→ 201 {"id":"<uuid>","titulo":"Clean Code",...}
```

### Regla práctica
- `save()` cuando necesitás la entidad completa de vuelta (con su id generado); `update()` cuando solo necesitás aplicar un cambio y ya sabés el id.

---

## Día 6-7: Repaso + CRUD completo del proyecto 🟡

Entities y CRUD de `Autor` y `Libro` funcionando contra el modelo real (falta la relación formal Libro↔Autor, que llega en la semana 6 junto con Query Builder).

---

## Checklist de cierre

- [ ] Puedo modelar una entity con las columnas y restricciones correctas sin buscar referencia
- [ ] Entiendo por qué `synchronize: true` es peligroso fuera de desarrollo
- [ ] Escribí una migración (a mano o generada) y sé cómo correrla
- [ ] Sé la diferencia exacta entre `save()` y `update()`
- [ ] El código compila contra las entities reales (verificado); el CRUD end-to-end contra Postgres queda pendiente de correr con una base de datos real disponible
