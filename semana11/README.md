# Semana 11 — Mini-proyecto Biblioteca + deploy

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana11/`
> Dominio: Biblioteca — cierre del nivel Básico. Consolida en un solo proyecto real todo lo construido en las semanas 1-10.

---

## Dónde estamos

Las semanas 1-10 construyeron cada concepto **aislado** (módulos, DI, DTOs, TypeORM, exception filters, config, paginación, upload+logging), casi siempre en memoria o en un mini-proyecto de una sola entidad. Esta semana no introduce sintaxis nueva: junta todo eso en un backend real que corre contra PostgreSQL, se dockeriza y se despliega.

## Arquitectura

```
src/
  autores/    autor.entity.ts, dto/, autores.service.ts, autores.controller.ts
  libros/     libro.entity.ts, dto/, libros.service.ts, libros.controller.ts
  usuarios/   usuario.entity.ts, dto/, usuarios.service.ts, usuarios.controller.ts
  prestamos/  prestamo.entity.ts, dto/, prestamos.service.ts, prestamos.controller.ts
  common/     filters/all-exceptions.filter.ts, exceptions/, interceptors/logging.interceptor.ts
  config/     app.config.ts, database.config.ts, env.validation.ts
  app.module.ts, main.ts
```

Relaciones: `Libro` ↔ `Autor` (muchos-a-muchos), `Usuario` → `Prestamo` (uno-a-muchos), `Libro` → `Prestamo` (uno-a-muchos).

Lo que trae cada semana anterior:

| Semana | Qué aporta al mini-proyecto |
|---|---|
| 3 | Inyección por constructor entre servicios (`LibrosService` ← `AutoresService`, `PrestamosService` ← `LibrosService` + `UsuariosService`) |
| 4 | DTOs con `class-validator` + `ValidationPipe` global (`whitelist`, `transform`) |
| 5-6 | Entities TypeORM con relaciones reales + Query Builder para filtros dinámicos |
| 7 | `AllExceptionsFilter` global + `LibroNoDisponibleException` de dominio |
| 8 | `ConfigModule` + validación de `.env` con Joi (`DATABASE_URL`, `PORT`, `NODE_ENV`) |
| 9 | Paginación offset-based + filtros + orden + versionado por URI (`/api/v1/...`) |
| 10 | Subida de portadas con Multer (tipo + tamaño) + `Logger`/`LoggingInterceptor` global |

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | healthcheck (sin versión) |
| GET | `/api/v1/autores` / `/:id` | listar / detalle |
| POST | `/api/v1/autores` | crear |
| PATCH \| DELETE | `/api/v1/autores/:id` | actualizar / eliminar |
| GET | `/api/v1/usuarios` / `/:id` / `/:id/prestamos` | listar / detalle / con préstamos |
| POST, PATCH, DELETE | `/api/v1/usuarios[/:id]` | CRUD |
| GET | `/api/v1/libros?page&limit&titulo&categoria&autorId&disponible&sort&order` | búsqueda paginada/filtrada |
| POST, PATCH, DELETE | `/api/v1/libros[/:id]` | CRUD |
| POST | `/api/v1/libros/:id/portada` | subir portada (multipart, campo `file`) |
| GET | `/api/v1/prestamos` | listar |
| POST | `/api/v1/prestamos` | crear (`{ libroId, usuarioId }`) |
| PATCH | `/api/v1/prestamos/:libroId/devolver` | devolver |

## Cómo correr en local

### Con Docker Compose (recomendado, igual que en el deploy real)
```bash
cd semana11
docker compose up --build
curl http://localhost:3000/api/health
```

### Sin Docker (Postgres propio)
```bash
cd semana11
npm install
cp .env.example .env   # ajustar DATABASE_URL si hace falta
npm run start:dev
```

## Cómo probar (flujo real)

```bash
# 1. crear autor
curl -X POST http://localhost:3000/api/v1/autores \
  -H "Content-Type: application/json" -d '{"nombre":"Robert C. Martin","nacionalidad":"USA"}'
# → 201 { "id": "<uuid-autor>", "nombre": "Robert C. Martin", ... }

# 2. crear libro con ese autor
curl -X POST http://localhost:3000/api/v1/libros \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Clean Code","isbn":"978-0132350884","anio":2008,"categoria":"tecnico","autoresIds":["<uuid-autor>"]}'
# → 201 { "id": "<uuid-libro>", "prestado": false, ... }

# 3. crear usuario
curl -X POST http://localhost:3000/api/v1/usuarios \
  -H "Content-Type: application/json" -d '{"nombre":"Ana","email":"ana@mail.com"}'
# → 201 { "id": "<uuid-usuario>", ... }

# 4. prestar el libro
curl -X POST http://localhost:3000/api/v1/prestamos \
  -H "Content-Type: application/json" -d '{"libroId":"<uuid-libro>","usuarioId":"<uuid-usuario>"}'
# → 201 { "id": "<uuid-prestamo>", ... }

# 5. intentar prestar el mismo libro otra vez → regla de negocio
curl -i -X POST http://localhost:3000/api/v1/prestamos \
  -H "Content-Type: application/json" -d '{"libroId":"<uuid-libro>","usuarioId":"<uuid-usuario>"}'
# → 409 { "statusCode":409, "message":"El libro <uuid-libro> no está disponible para préstamo", ... }

# 6. devolver
curl -X PATCH http://localhost:3000/api/v1/prestamos/<uuid-libro>/devolver
# → 200 { "ok": true }

# 7. subir portada
curl -X POST -F "file=@portada.png;type=image/png" \
  http://localhost:3000/api/v1/libros/<uuid-libro>/portada
# → 201 { "portadaUrl": "/uploads/portadas/<uuid>.png", ... }

# 8. búsqueda paginada
curl "http://localhost:3000/api/v1/libros?page=1&limit=10&categoria=tecnico&disponible=true"
```

## Decisiones arquitectónicas

- **`synchronize: true`**: para simplificar el deploy de este proyecto de aprendizaje (sin correr migraciones a mano en Render/Railway). En un proyecto real de producción se reemplaza por migraciones versionadas (semanas 5-6) ejecutadas en el arranque del contenedor.
- **Almacenamiento de portadas en disco (`diskStorage`)**: solo funciona con un volumen persistente (ver `docker-compose.yml`) o en plataformas con disco persistente en el free tier. Un proyecto real con múltiples instancias necesitaría un bucket externo (S3, Cloudinary).
- **Versionado por URI** (`/api/v1/...`) con `VERSION_NEUTRAL` en `/api/health`: el healthcheck de Docker/Render no debe depender de una versión de API.
- **`AllExceptionsFilter` global**: toda la API responde errores con el mismo formato (`statusCode`, `message`, `error`, `timestamp`, `path`), sea un 404 de Nest, un 400 de validación o un 500 no manejado.

## Dockerfile (multi-stage)

`Dockerfile` compila en una imagen `node:20-alpine` con las devDependencies (`npm ci` + `npm run build`) y copia solo el `dist/` resultante a una segunda imagen liviana con `npm ci --omit=dev`. Esto evita que las devDependencies (TypeScript, `@nestjs/cli`, etc.) viajen a producción.

## Deploy real (Render o Railway)

Ambos son free-tier y soportan Dockerfile + PostgreSQL gestionado. Pasos (idénticos en espíritu en los dos):

### Render
1. Crear un **PostgreSQL** gestionado (Render → New → PostgreSQL) y copiar su **Internal Database URL**.
2. Crear un **Web Service** → conectar el repo de GitHub → carpeta raíz `semana11/` → Environment: **Docker** (Render detecta el `Dockerfile`).
3. Variables de entorno del Web Service:
   - `NODE_ENV=production`
   - `DATABASE_URL=<Internal Database URL del paso 1>`
   - (Render inyecta `PORT` automático; el `main.ts` ya lo respeta con `process.env.PORT`)
4. Deploy. Verificar con `curl https://<tu-app>.onrender.com/api/health`.
5. **Portadas**: el free tier de Render no tiene disco persistente entre deploys — para este nivel Básico es aceptable perder `/uploads` en cada redeploy (documentado como limitación conocida).

### Railway
1. `railway init` en `semana11/` (o desde el dashboard: New Project → Deploy from GitHub repo, root `semana11/`).
2. Añadir un plugin **PostgreSQL** desde el dashboard de Railway — expone `DATABASE_URL` automático en las variables del servicio.
3. Railway detecta el `Dockerfile` solo; si no, fijar el Builder a "Dockerfile" en Settings.
4. Variables: `NODE_ENV=production` (Railway ya inyecta `DATABASE_URL` y `PORT`).
5. Deploy. Verificar con `curl https://<tu-app>.up.railway.app/api/health`.

> Nota: el deploy real requiere una cuenta del usuario en Render/Railway — este repo deja el `Dockerfile`, `docker-compose.yml` y los pasos exactos, pero la ejecución final (crear cuenta, conectar repo, pegar variables) la hace el usuario con sus propias credenciales.

## Checklist de cierre

- [ ] `docker compose up --build` levanta la API + Postgres y `/api/health` responde 200
- [ ] Los 4 módulos (Libros, Autores, Usuarios, Préstamos) tienen CRUD funcionando end-to-end
- [ ] Un préstamo sobre un libro ya prestado devuelve 409 con el formato de error consistente
- [ ] La subida de portada valida tipo y tamaño antes de guardar
- [ ] `.env` nunca se commitea (ver `.gitignore`); `.env.example` documenta las variables necesarias
- [ ] Deploy real hecho en Render o Railway con Postgres gestionado
