# NestJS Learning Path

Repositorio de práctica para mi ruta de aprendizaje de **NestJS**, orientada a un backend developer con experiencia previa en **Java / Spring Boot**. La idea del roadmap es aprovechar ese conocimiento previo (DI, arquitectura en capas, ORM, guards de seguridad, testing) y traducirlo al ecosistema Node/TypeScript, en vez de aprender desde cero.

Como hilo conductor de este nivel se construye un **Sistema de Gestión de Biblioteca** (libros, autores, usuarios, préstamos) que cierra con deploy real — el proyecto de portafolio del nivel Básico.

Esta ruta completa (Básico → Intermedio → Avanzado) tiene **37 semanas** en total. Este documento cubre el **Nivel Básico: 13 semanas**. Cada semana cierra con un avance concreto sobre el Sistema de Biblioteca que vive en su propia carpeta (`semanaNN/` resuelta + `practica-semanaNN/` espejo con `// TODO`).

## Stack y contexto de la ruta

- **Node.js + TypeScript** en modo `strict`.
- **NestJS** (CLI, Modules, Controllers, Providers).
- **TypeORM** + **PostgreSQL** para persistencia y migraciones.
- **class-validator / class-transformer** para DTOs y Pipes.
- **Zod** para validación de variables de entorno.
- **Helmet** para hardening de headers HTTP.
- **Multer** para carga de archivos.
- **Docker** para el deploy final del mini-proyecto.
- **Render/Railway** para el despliegue real (free tier).

## Roadmap semana a semana — Nivel Básico

### 🟡 Básico — Sistema de Gestión de Biblioteca

**Semana 1 — TypeScript esencial para Nest** ✅
**Carpeta:** [`Semana 1/`](../Semana%201) · [`semana01/`](./semana01) · práctica: [`practica-semana01/`](./practica-semana01)

Blindar los fundamentos que Nest explota a fondo: generics y utility types (`Partial`, `Pick`, `Omit`), `interface` vs `type` vs `class` (tipado estructural vs nominal de Java), decorators desde cero y `reflect-metadata`, y `tsconfig.json` en modo `strict`.

**Mini-proyecto:** 3 decorators propios sin Nest (clase, método, propiedad) y una función genérica `paginate<T>`, como base conceptual para todo lo que sigue.

**Semana 2 — Nest CLI, Modules y Controllers** ✅
**Carpeta:** [`Semana 2/`](../Semana%202) · [`semana02/`](./semana02) · práctica: [`practica-semana02/`](./practica-semana02)

Arquitectura modular de Nest: `NestFactory.create()`, anatomía de `@Module()` (`imports`/`controllers`/`providers`/`exports`), módulos de feature vs `AppModule` raíz, `@Controller()`/`@Get()`/`@Post()`/`@Param()`/`@Body()`, y una introducción a Dynamic Modules (`forRoot()`/`forFeature()`).

**Mini-proyecto:** diseño de la arquitectura de módulos completa de Biblioteca (`Libros`, `Autores`, `Prestamos`, `Usuarios`) + `LibrosController` con CRUD hardcodeado.

**Semana 3 — Providers y Dependency Injection** ✅
**Carpeta:** [`Semana 3/`](../Semana%203) · [`semana03/`](./semana03) · práctica: [`practica-semana03/`](./practica-semana03)

El corazón de cómo Nest conecta todo: inyección por constructor (y cómo `reflect-metadata` la resuelve), scopes de providers (`DEFAULT`/`REQUEST`/`TRANSIENT`), custom providers (`useValue`/`useClass`/`useFactory`), y tokens de inyección (`@Inject('TOKEN')`) para interfaces y primitivos.

**Mini-proyecto:** capa de servicios completa de Biblioteca (`LibrosService`, `AutoresService`, `PrestamosService`) interconectada por DI, en memoria (sin BD todavía).

**Semana 4 — DTOs, class-validator y Pipes** ✅
**Carpeta:** [`Semana 4/`](../Semana%204) · [`semana04/`](./semana04) · práctica: [`practica-semana04/`](./practica-semana04)

Blindar la API contra datos malformados: DTOs vs Entity, decoradores de `class-validator` (`@IsString`, `@IsEmail`, `@MinLength`...), `ValidationPipe` global (`whitelist`, `transform`), Pipes personalizados (`implements PipeTransform`), y validaciones anidadas/condicionales (`@ValidateNested`, `@ValidateIf`).

**Mini-proyecto:** todos los DTOs del sistema de Biblioteca (Libro, Autor, Préstamo, Usuario) con validaciones robustas probadas contra requests reales.

**Semana 5 — TypeORM: Entities y Repository** ✅ (compilado; requiere Postgres para correr)
**Carpeta:** [`Semana 5/`](../Semana%205) · [`semana05/`](./semana05) · práctica: [`practica-semana05/`](./practica-semana05)

Formalizar el uso de TypeORM: `@Entity()`/`@Column()` y sus opciones, `TypeOrmModule.forRoot()` vs `forFeature()`, `@InjectRepository()`, migraciones vs `synchronize: true`, y operaciones CRUD con Repository (`find`, `save`, `update`, `delete`).

**Mini-proyecto:** entities y migraciones de todo el sistema (Libro, Autor, Usuario, Préstamo) con el CRUD básico funcionando contra PostgreSQL real.

**Semana 6 — TypeORM: relaciones y Query Builder** ✅ (compilado; requiere Postgres para correr)
**Carpeta:** [`Semana 6/`](../Semana%206) · [`semana06/`](./semana06) · práctica: [`practica-semana06/`](./practica-semana06)

Modelar relaciones reales: `@OneToMany`/`@ManyToOne` (Usuario-Préstamo), `@ManyToMany` (Libro↔Autor), `createQueryBuilder()` con joins, y filtros dinámicos combinables con whitelist de columnas.

**Mini-proyecto:** módulo de préstamos completo (crear préstamo, devolver libro y actualizar disponibilidad) + endpoint de búsqueda avanzada de libros.

**Semana 7 — Exception Filters y manejo de errores** ✅
**Carpeta:** [`Semana 7/`](../Semana%207) · [`semana07/`](./semana07) · práctica: [`practica-semana07/`](./practica-semana07)

Estandarizar las respuestas de error: excepciones HTTP built-in (`NotFoundException`, `ConflictException`...) con el código correcto según el caso, Exception Filters personalizados (`@Catch()`, `ExceptionFilter`), un formato de error consistente (`statusCode`/`message`/`timestamp`/`path`), y excepciones de dominio propias (`LibroNoDisponibleException`).

**Mini-proyecto:** auditoría completa de Biblioteca: cada posible fallo (no encontrado, duplicado, sin stock, datos inválidos) devuelve el código y formato correcto.

**Semana 8 — ConfigModule, env y profiles** ✅
**Carpeta:** [`Semana 8/`](../Semana%208) · [`semana08/`](./semana08) · práctica: [`practica-semana08/`](./practica-semana08)

Separar configuración de código: `ConfigModule.forRoot({ isGlobal: true })`, `ConfigService`, validación de `.env` con schema (falla rápido si falta una variable crítica), múltiples entornos (`.env.development`/`.env.test`/`.env.production`), y namespaces tipados con `registerAs()`.

**Mini-proyecto:** Biblioteca 100% configurada por variables validadas, sin ningún valor hardcodeado.

**Semana 9 — Paginación, filtros y versionado** ✅
**Carpeta:** [`Semana 9/`](../Semana%209) · [`semana09/`](./semana09) · práctica: [`practica-semana09/`](./practica-semana09)

Lo que separa un endpoint de tutorial de uno listo para producción: paginación offset-based (`skip`/`take` + metadata), el concepto de paginación cursor-based y cuándo se justifica, filtros y ordenamiento dinámico con whitelist, y versionado de API (por URI, header o media type).

**Mini-proyecto:** todos los endpoints de listado de Biblioteca (libros, autores, préstamos) con paginación, filtros y versionado consistentes.

**Semana 10 — Carga de archivos y logging** ✅
**Carpeta:** [`Semana 10/`](../Semana%2010) · [`semana10/`](./semana10) · práctica: [`practica-semana10/`](./practica-semana10)

Dos utilitarios de cualquier backend real: carga de archivos con Multer (`FileInterceptor`, validación de tipo MIME y tamaño), almacenamiento local vs cloud, el `Logger` incorporado de Nest por niveles y contexto, e Interceptors básicos de logging de requests.

**Mini-proyecto:** subida de portadas de libros con validación completa + logging consistente en todo el sistema.

**Semana 11 — Mini-proyecto Biblioteca + deploy** ✅ (Dockerfile + docker-compose verificados end-to-end; deploy real en Render/Railway pendiente de credenciales del usuario)
**Carpeta:** [`semana11/`](./semana11) · práctica: [`practica-semana11/`](./practica-semana11)

Cierre del nivel: consolidación de los 4 módulos, testing manual exhaustivo (casos válidos e inválidos), documentación del proyecto (README + decisiones arquitectónicas), `Dockerfile` y deploy en un servicio gratuito (Render/Railway) con PostgreSQL gestionado.

**Mini-proyecto (final del nivel):** Sistema de Gestión de Biblioteca completo — CRUD, relaciones, DTOs validados, manejo de errores, configuración por entornos, paginación/filtros/versionado, carga de archivos y logging — desplegado y accesible por URL pública.

**Semana 12 — Helmet y security headers** ✅
**Carpeta:** [`semana12/`](./semana12) · práctica: [`practica-semana12/`](./practica-semana12)

Hardening de la API a nivel de headers HTTP: qué previene cada header (`X-Frame-Options`, `X-Content-Type-Options: nosniff`, `Strict-Transport-Security`, `Content-Security-Policy`), instalar y configurar `helmet()` en `main.ts`, ajustar CSP para APIs vs SPAs, y CORS como capa complementaria (no reemplazo) de Helmet.

**Mini-proyecto:** auditoría de headers con `curl -I` sobre un endpoint propio, explicando qué ataque previene cada uno.

**Semana 13 — Validación de entorno con Zod** ✅
**Carpeta:** [`semana13/`](./semana13) · práctica: [`practica-semana13/`](./practica-semana13)

Cierre del bloque ampliado: quién valida `process.env` antes de que la app arranque. `z.object()`/`.coerce`/`.regex()`, diseño de un `envSchema` completo (`JWT_SECRET.min(32)`, formatos de expiración de tokens), integración en el bootstrap para fallar rápido y claro, y la diferencia entre Zod (config estática) y `class-validator` (DTOs de request).

**Mini-proyecto:** `envSchema` endurecido cubriendo todas las variables críticas del proyecto, con mensajes de error legibles.

## Proyecto de portafolio del nivel

**Sistema de Gestión de Biblioteca** — módulos `Libros`/`Autores`/`Usuarios`/`Prestamos`, CRUD con DTOs validados, relaciones reales (muchos-a-muchos y uno-a-muchos), manejo de errores consistente, configuración por entornos, paginación/filtros/versionado, carga de portadas, logging, hardening con Helmet y validación de entorno con Zod — desplegado en producción.

## Progreso

| Semana | Tema | Estado |
|---|---|---|
| 1 | TypeScript esencial para Nest | ✅ Completado |
| 2 | Nest CLI, Modules y Controllers | ✅ Completado |
| 3 | Providers y Dependency Injection | ✅ Completado |
| 4 | DTOs, class-validator y Pipes | ✅ Completado |
| 5 | TypeORM — Entities y Repository | ✅ Completado (compilado; CRUD contra Postgres real sin correr) |
| 6 | TypeORM — relaciones y Query Builder | ✅ Completado (compilado; CRUD contra Postgres real sin correr) |
| 7 | Exception Filters y manejo de errores | ✅ Completado |
| 8 | ConfigModule, env y profiles | ✅ Completado |
| 9 | Paginación, filtros y versionado | ✅ Completado |
| 10 | Carga de archivos y logging | ✅ Completado |
| 11 | Mini-proyecto Biblioteca + deploy | ✅ Completado (Docker verificado; deploy real requiere cuenta Render/Railway del usuario) |
| 12 | Helmet y security headers | ✅ Completado |
| 13 | Validación de entorno con Zod | ✅ Completado |

## Estructura del repo

| Carpeta | Qué es |
|---|---|
| `semanaNN/` | semana **resuelta** (referencia, día a día) |
| `practica-semanaNN/` | espejo con `// TODO` para resolver a mano (mirá `../semanaNN` si te trabás) |

## Convención

- Cada semana es un proyecto TypeScript independiente con su `package.json` y `tsconfig.json`.
- La práctica valida incrementalmente compilando sin errores en cada paso (`npx tsc` en la semana 1; `npm run build` desde la semana 2, que ya es un proyecto Nest).
- Base de comparación de todo el path: **Java / Spring Boot**.
- El README de cada semana resuelta sigue el formato de bitácora día a día (mapa mental vs Java, teoría, cómo se compara, qué se construye, cómo probar, regla práctica).

## Cómo usar una práctica

```
cd practica-semanaNN
npm install
# resolvé los // TODO y después de cada paso:
npm run build
# semana 1 (TS puro) usa npx tsc; semana 2+ es Nest y usa `nest build`
# al final, levantá y probá (semana 2+):
npm run start:dev
curl http://localhost:3000/api/libros
```

## Por qué este enfoque

Cada semana está diseñada como una traducción directa desde Java/Spring Boot hacia su equivalente en NestJS (DI vía `ApplicationContext` → contenedor IoC de Nest, `@Component`/`@Service` → `@Injectable()`, JPA/Hibernate → TypeORM, `@ControllerAdvice` → Exception Filters, `application-*.properties` → `ConfigModule` + `.env`), para acelerar el aprendizaje apoyándome en conceptos que ya domino en vez de partir de cero. Usar un dominio real (Sistema de Gestión de Biblioteca) que cierra con deploy convierte la ruta en una pieza de portafolio comparable, antes de escalar a los niveles Intermedio (Plataforma de Eventos y Ticketing) y Avanzado (Sistema de Pedidos E-commerce Distribuido).
