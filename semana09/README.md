# Semana 9 — Paginación, filtros y versionado

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana09/`
> Dominio: Biblioteca — el CRUD ya funciona; esta semana lo hace usable a escala.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `Pageable` + `Page<T>` (Spring Data) | `{ data, total, page, totalPages }` armado a mano | Nest no tiene un tipo `Page<T>` nativo: el formato lo definís vos (y lo mantenés consistente) |
| `@PageableDefault(size = 20)` | `@Query('limit') limit = '5'` con default explícito | mismo objetivo, sintaxis distinta |
| `Sort.by("titulo").ascending()` | ordenar a mano con whitelist de columnas | Spring Data también necesita whitelist si el sort viene de un query param libre |
| `@RequestMapping("/api/v1/...")` fijo en la URL | `@Controller({ path: 'libros', version: '1' })` + `enableVersioning()` | Nest separa versión de path; podés cambiar la estrategia (URI/header) sin tocar cada controller |
| Sin versionado nativo (se arma a mano con paths) | `VersioningType.URI` / `HEADER` / `MEDIA_TYPE` built-in | Nest trae 3 estrategias de versionado de fábrica |

---

## Día 1-2: Paginación offset-based 🟡

### Teoría
`page` y `limit` como query params; `skip = (page - 1) * limit`, `take = limit`. La respuesta incluye metadata (`total`, `page`, `totalPages`) para que el cliente sepa cuántas páginas hay.

### Cómo se compara con Spring Boot
Spring Data resuelve esto con `Pageable` inyectado directo en el controller y devuelve un `Page<T>` con la metadata ya armada. En Nest no hay nada de fábrica: se arma el objeto de respuesta a mano (acá `ResultadoPaginado<T>`), lo cual da más control pero exige mantener el formato consistente en todos los endpoints.

### Qué construimos
```
GET /api/v1/libros?page=1&limit=5
→ { data: [...5 libros...], total: 12, page: 1, totalPages: 3 }
```

### Cómo probar (salida real)
```
curl "http://localhost:3000/api/v1/libros?page=1&limit=5"
→ {"data":[...5 libros...],"total":12,"page":1,"totalPages":3}

curl "http://localhost:3000/api/v1/libros?page=2&limit=5"
→ {"data":[...siguientes 5...],"total":12,"page":2,"totalPages":3}
```

### Regla práctica
- Nunca un endpoint de listado sin paginar por defecto (`limit` con default razonable, ej. 20 o 5 en este demo).

---

## Día 3: Paginación cursor-based (conceptual) 🟡

### Teoría
Offset-based falla en datasets grandes que cambian entre requests: si se inserta un registro nuevo mientras el cliente pagina, puede ver un ítem duplicado o saltarse uno (páginas "fantasma"). Cursor-based pagina por un puntero (ej. el `id` del último ítem visto), no por número de página.

### Cómo se compara con Spring Boot
Spring Data soporta `Slice<T>` (más liviano que `Page<T>`, sin `count` total) como paso intermedio, pero el cursor-based real (`keyset pagination`) se implementa igual de manual en ambos stacks: no es algo que el framework resuelva solo.

### Nota técnica (sin código — es un ejercicio de análisis)
En el endpoint de listado de préstamos de un sistema con mucho volumen (inserciones constantes), cursor-based evitaría el problema de páginas fantasma que sí puede aparecer en `GET /api/v1/libros` si el catálogo creciera rápido mientras alguien pagina resultados filtrados.

### Regla práctica
- Cursor-based se justifica cuando el dataset es grande **y** cambia mientras se pagina. Para catálogos chicos o que no cambian en el momento de la consulta, offset-based alcanza y es más simple.

---

## Día 4: Filtros y ordenamiento dinámico 🟡

### Teoría
Query params opcionales combinables (`?categoria=ficcion&disponible=true`) y ordenamiento (`?sort=titulo&order=asc`), siempre validando los valores permitidos con una whitelist — nunca usar el string del query param directo como nombre de columna.

### Cómo se compara con Spring Boot
Si armás el `Sort` de Spring Data a partir de un string libre del cliente, tenés el mismo riesgo: hay que whitelistear igual. La ventaja de Spring es que `Sort.by(field)` ya lanza si el campo no existe en la entity; en Nest la whitelist es 100% responsabilidad tuya.

### Qué construimos
```
SORT_PERMITIDOS = ['titulo', 'categoria']  ← whitelist explícita
```

### Cómo probar (salida real)
```
curl "http://localhost:3000/api/v1/libros?categoria=ficcion&disponible=true&sort=titulo&order=desc&limit=10"
→ {"data":[{"titulo":"Libro 10",...},{"titulo":"Libro 07",...},{"titulo":"Libro 04",...}],"total":3,"page":1,"totalPages":1}
```

### Regla práctica
- Si `sort` no está en la whitelist, se ignora (no se rompe el endpoint, simplemente no ordena) — mejor eso que un 500 por un nombre de campo inesperado.

---

## Día 5: Versionado de API 🟡

### Teoría
`app.enableVersioning({ type: VersioningType.URI })` habilita versionado por path (`/v1/...`). Cada controller o ruta declara su versión; `VERSION_NEUTRAL` la deja fuera del esquema (útil para health checks).

### Cómo se compara con Spring Boot
Spring no trae versionado de API nativo: se arma a mano con paths (`/api/v1/...` hardcodeado) o con content negotiation manual. Nest lo abstrae: cambiar de estrategia (URI → header) es una sola línea en `main.ts`, sin tocar cada controller.

### Qué construimos
```
main.ts: app.enableVersioning({ type: VersioningType.URI })
AppController      → @Controller({ version: VERSION_NEUTRAL })  → /api
LibrosController   → @Controller({ path: 'libros', version: '1' }) → /api/v1/libros
```

### Cómo probar (salida real)
```
curl http://localhost:3000/api
→ Biblioteca API — Semana 9: Paginación, filtros y versionado

curl http://localhost:3000/api/v1/libros?limit=1
→ {"data":[...],"total":12,"page":1,"totalPages":12}
```

### Regla práctica
- Versioná cuando vas a introducir un breaking change; agregar un campo opcional nuevo a la respuesta no necesita una versión nueva.

---

## Día 6-7: Repaso + endpoints finales 🟡

El endpoint de listado de libros queda con paginación, filtros combinables (categoría + disponibilidad) y ordenamiento whitelisteado, todo bajo `/v1`, con el endpoint raíz (`/api`) fuera del esquema de versiones.

---

## Checklist de cierre

- [ ] Mis endpoints de listado nunca devuelven todo sin paginar
- [ ] Los filtros validan valores permitidos antes de tocar la query
- [ ] Entiendo cuándo cursor-based sería mejor que offset-based
- [ ] Mi API tiene versionado activado (verificado con una corrida real)
