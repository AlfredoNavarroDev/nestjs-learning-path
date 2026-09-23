# Práctica — Semana 9 (Paginación, filtros y versionado)

Mini-proyecto integrador de la semana 9: el listado de libros de Biblioteca listo para producción.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana09` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/libros/libros.service.ts` — paginación y filtros
**Propósito:** aplicar filtros combinables y paginar offset-based con metadata.
**Archivos:** `src/libros/libros.service.ts`
- [ ] TODO 1: filtrar por `categoria` si vino
- [ ] TODO 2: filtrar por `disponible` si vino
- [ ] TODO 3: ordenar por `sort`/`order` si vino `sort`
- [ ] TODO 4: `start = (page - 1) * limit` y `data = resultado.slice(start, start + limit)`

### 2. `src/libros/libros.controller.ts` — versionado + whitelist de sort
**Propósito:** exponer el endpoint bajo `/v1` y no aceptar cualquier columna para ordenar.
**Archivos:** `src/libros/libros.controller.ts`
- [ ] TODO 5: `@Controller({ path: 'libros', version: '1' })`
- [ ] TODO 6: validar `sort` contra `SORT_PERMITIDOS` antes de pasarlo al service

### 3. `src/main.ts` y `src/app.controller.ts` — activar versionado
**Propósito:** habilitar el versionado por URI a nivel de app, dejando el endpoint raíz fuera del esquema.
**Archivos:** `src/main.ts`, `src/app.controller.ts`
- [ ] TODO 7: `app.enableVersioning({ type: VersioningType.URI })`
- [ ] TODO 8: `@Controller({ path: '', version: VERSION_NEUTRAL })` en `AppController`

Después de terminar:

```
npm run start:dev
curl "http://localhost:3000/api/v1/libros?page=1&limit=5"
curl http://localhost:3000/api
```

## Checklist de cierre

- [ ] Mis endpoints de listado nunca devuelven todo sin paginar
- [ ] Los filtros validan valores permitidos antes de tocar la query
- [ ] Mi API tiene versionado activado
