# Práctica — Semana 5 (TypeORM: Entities y Repository)

Mini-proyecto integrador de la semana 5: persistencia real de Biblioteca con TypeORM.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana05` (mismo tema ya resuelto, día a día).
⚠️ Requiere PostgreSQL corriendo para probar en runtime (ver `.env.example`); podés completar y validar todos los TODOs solo con `npm run build` (compilación), sin necesidad de una base de datos.

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/autores/autor.entity.ts` y `src/libros/libro.entity.ts` — decoradores de Entity
**Propósito:** mapear las clases a tablas reales (tu `@Entity` + `@Column` de JPA).
**Archivos:** `src/autores/autor.entity.ts`, `src/libros/libro.entity.ts`
- [ ] TODO 1: `@Entity('autores')` en la clase `Autor`
- [ ] TODO 2: `@PrimaryGeneratedColumn('uuid')` en `id`
- [ ] TODO 3: `@Column({ type: 'varchar', length: 150 })` en `nombre`
- [ ] TODO 4: `@Column({ type: 'varchar', length: 80, nullable: true })` en `nacionalidad`
- [ ] TODO 5: `@Entity('libros')` en la clase `Libro`
- [ ] TODO 6: `@Column({ type: 'varchar', length: 17, unique: true })` en `isbn`

### 2. `src/autores/autores.service.ts` — Repository inyectado
**Propósito:** reemplazar el array en memoria por un `Repository<Autor>` real.
**Archivos:** `src/autores/autores.service.ts`
- [ ] TODO 7: inyectar `@InjectRepository(Autor) autoresRepo: Repository<Autor>` por constructor
- [ ] TODO 8: `findAll()` → `this.autoresRepo.find()`
- [ ] TODO 9: `findOne()` → `this.autoresRepo.findOneBy({ id })`
- [ ] TODO 10: `existe()` → `(await this.autoresRepo.countBy({ id })) > 0`
- [ ] TODO 11: `create()` → `this.autoresRepo.create(data)` + `save()`

### 3. `src/autores/autores.module.ts` y `src/libros/libros.module.ts` — `forFeature()`
**Propósito:** registrar cada entity en su módulo de feature.
**Archivos:** `src/autores/autores.module.ts`, `src/libros/libros.module.ts`
- [ ] TODO 12: `imports: [TypeOrmModule.forFeature([Autor])]`
- [ ] TODO 16: `imports: [TypeOrmModule.forFeature([Libro]), AutoresModule]`

### 4. `src/libros/libros.service.ts` — CRUD completo
**Propósito:** las 4 operaciones básicas contra el repository.
**Archivos:** `src/libros/libros.service.ts`
- [ ] TODO 13: `create()` valida con `autoresService.existe()`, luego `create()` + `save()`
- [ ] TODO 14: `update()` → `this.librosRepo.update({ id }, data)` + `findOne()`
- [ ] TODO 15: `remove()` → `this.librosRepo.delete({ id })`

### 5. `src/app.module.ts` — conexión global
**Propósito:** configurar `TypeOrmModule.forRoot()` una sola vez, en el módulo raíz.
**Archivos:** `src/app.module.ts`
- [ ] TODO 17: `TypeOrmModule.forRoot({ type: 'postgres', host, port, username, password, database, entities: [Autor, Libro], synchronize: false })`

Después de terminar (con Postgres disponible):

```
npm run start:dev
curl http://localhost:3000/api/autores
```

## Checklist de cierre

- [ ] Puedo modelar una entity con las columnas y restricciones correctas sin buscar referencia
- [ ] Entiendo por qué `synchronize: true` es peligroso fuera de desarrollo
- [ ] Sé la diferencia exacta entre `save()` y `update()`
- [ ] El proyecto compila sin errores (`npm run build`)
