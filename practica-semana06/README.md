# Práctica — Semana 6 (TypeORM: relaciones y Query Builder)

Mini-proyecto integrador de la semana 6: relaciones reales entre Libro, Autor, Usuario y Préstamo.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana06` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/usuarios/usuario.entity.ts` y `src/prestamos/prestamo.entity.ts` — uno-a-muchos
**Propósito:** modelar `Usuario`/`Libro` (1) → `Prestamo` (N).
**Archivos:** `src/usuarios/usuario.entity.ts`, `src/prestamos/prestamo.entity.ts`
- [ ] TODO 1: `@OneToMany(() => Prestamo, prestamo => prestamo.usuario)` en `Usuario.prestamos`
- [ ] TODO 2: `@ManyToOne(() => Libro, libro => libro.prestamos)` + `@JoinColumn({ name: 'libro_id' })` en `Prestamo.libro`
- [ ] TODO 3: `@ManyToOne(() => Usuario, usuario => usuario.prestamos)` + `@JoinColumn({ name: 'usuario_id' })` en `Prestamo.usuario`

### 2. `src/libros/libro.entity.ts` y `src/autores/autor.entity.ts` — muchos-a-muchos
**Propósito:** un libro puede tener varios autores y viceversa.
**Archivos:** `src/libros/libro.entity.ts`, `src/autores/autor.entity.ts`
- [ ] TODO 4: `@ManyToMany(() => Autor, autor => autor.libros)` + `@JoinTable()` en `Libro.autores` (lado dueño)
- [ ] TODO 5: `@ManyToMany(() => Libro, libro => libro.autores)` en `Autor.libros` (lado inverso, sin `@JoinTable`)

### 3. `src/libros/libros.service.ts` — Query Builder
**Propósito:** joins explícitos y filtros dinámicos combinables.
**Archivos:** `src/libros/libros.service.ts`
- [ ] TODO 6: `findAllConAutores()` → `createQueryBuilder('libro').leftJoinAndSelect('libro.autores', 'autor').getMany()`
- [ ] TODO 7: filtro por `titulo` con `ILIKE` y parámetro nombrado
- [ ] TODO 8: filtro por `autorId`
- [ ] TODO 9: filtro por `disponible` (negando `prestado`)

Después de terminar (con Postgres disponible):

```
npm run start:dev
curl "http://localhost:3000/api/libros/buscar?titulo=clean&disponible=true"
```

## Checklist de cierre

- [ ] Puedo modelar una relación uno-a-muchos y muchos-a-muchos sin buscar sintaxis
- [ ] Entiendo cuándo una relación debería ser eager y cuándo explícita
- [ ] Sé cuándo el repository simple no alcanza y necesito Query Builder
- [ ] El proyecto compila sin errores (`npm run build`)
