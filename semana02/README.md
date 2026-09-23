# Semana 2 — Nest CLI, Modules y Controllers

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `Semana 2/`
> Dominio: Biblioteca — arranca Nest formalmente: la arquitectura modular (modules + controllers) contra la estructura en capas de Spring.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `@SpringBootApplication` + component scan | `@Module()` raíz con `imports` explícitos | Nest **no escanea**: armás el grafo a mano, módulo por módulo |
| Arquitectura en **capas** (controller/service/repo por paquete) | Arquitectura **modular** (un módulo por feature) | Nest agrupa por feature; las capas viven *dentro* de cada módulo |
| `@RestController` + `@RequestMapping` | `@Controller()` + decorador de ruta | mismo rol, decoradores distintos |
| `@GetMapping` / `@PostMapping` / `@DeleteMapping` | `@Get()` / `@Post()` / `@Delete()` | 1:1 |
| `@RequestParam` / `@PathVariable` / `@RequestBody` | `@Query()` / `@Param()` / `@Body()` | 1:1 |
| `ResponseEntity.noContent()` | `@HttpCode(204)` | el status se declara con un decorador, no con un tipo de retorno |
| `SpringApplication.run()` | `NestFactory.create()` + `app.listen()` | mismo rol de bootstrap |
| `server.servlet.context-path` | `app.setGlobalPrefix('api')` | misma idea, en código |

---

## Día 1-2: Anatomía de main.ts y el bootstrap 🟡

### Teoría
`NestFactory.create(AppModule)` instancia el `INestApplication` (el ApplicationContext de Nest). `setGlobalPrefix()` y `enableCors()` configuran la app; `app.listen(3000)` arranca el servidor HTTP.

### Cómo se compara con Spring Boot
- `SpringApplication.run(App.class)` = `NestFactory.create(AppModule)`: ambos levantan el contenedor desde una clase raíz.
- La diferencia clave: en Spring el `main` es casi invisible y la config vive en annotations + properties; en Nest el `main.ts` es **el lugar** donde configurás prefix, CORS, middlewares y pipes globales, explícito y en orden.

### Qué construimos
```
NestFactory.create(AppModule)
  └─ app.setGlobalPrefix('api')
  └─ app.enableCors()
  └─ app.listen(3000)
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/main.ts` | bootstrap + configuración global |
| `src/app.module.ts` | módulo raíz |
| `src/app.controller.ts` + `src/app.service.ts` | controller/provider de arranque (lo genera `nest new`) |

### Cómo probar
```
npm run start:dev
curl http://localhost:3000/api
```
Salida real:
```
Biblioteca API — Semana 2: Nest CLI, Modules y Controllers
```
Sin el prefijo `api`, la misma ruta da 404 (`curl http://localhost:3000/`).

### Regla práctica
- El `main.ts` es tu `@SpringBootApplication` + configuración global, todo en código.
- Cualquier middleware/prefix/pipeline global va acá, antes de `listen()`.

---

## Día 3: Modules a fondo 🟡

### Teoría
`@Module()` tiene 4 claves: `imports` (otros módulos), `controllers`, `providers`, `exports` (lo que otros módulos pueden consumir). El `AppModule` raíz ensambla los módulos de feature.

### Cómo se compara con Spring Boot
Esta es la diferencia **más importante** de la semana:
- Spring hace *component scan*: recorre paquetes y arma el contexto solo.
- Nest **no escanea nada**: el grafo se arma explícito. Si un módulo no está en `imports`, no existe. Más verboso, pero el grafo de dependencias es visible y predecible.
- `exports` es el equivalente a exponer un `@Bean` reutilizable: sin `exports`, el provider es privado del módulo.

### Qué construimos
```
AppModule (raíz)
 ├─ imports: LibrosModule
 └─ imports: AutoresModule
LibrosModule   → controllers: [LibrosController]
AutoresModule  → controllers: [AutoresController]
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/libros.module.ts` | módulo de feature `libros` |
| `src/autores/autores.module.ts` | módulo de feature `autores` |

### Cómo probar
```
npm run build        # compila con los 2 módulos conectados
npm run start:dev
curl http://localhost:3000/api/libros   # si responde, el módulo quedó cableado al raíz
```

### Regla práctica
- Un módulo = una feature; no un paquete global `controllers/`.
- Si un módulo usa un provider de otro: el otro debe `exports`, y este debe `imports`.

---

## Día 4: Controllers y decoradores de ruta 🟡

### Teoría
`@Controller('libros')` define el prefijo; `@Get/@Post/@Delete` + `@Param/@Query/@Body` mapean la ruta; `@HttpCode()` fija el status. El controller **nunca** lleva lógica de negocio.

### Cómo se compara con Spring Boot
Mapping casi 1:1 con `@RestController`/`@RequestMapping`. Las diferencias clave:
- Spring controla el status con el tipo de retorno (`ResponseEntity`); Nest lo declara con `@HttpCode()`.
- `@Body()` ya viene tipado por el DTO (gracias al tipado estructural de la semana 1); en Spring usás `@RequestBody DTO` con `@Valid` aparte.

### Qué construimos
```
GET    /api/libros               → lista
GET    /api/libros/:id           → uno
POST   /api/libros               → crea (201)
DELETE /api/libros/:id           → elimina (204)
GET    /api/libros?prestado=true → filtro por query
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/libros.controller.ts` | CRUD hardcodeado (sin service todavía) |
| `src/autores/autores.controller.ts` | GET lista + uno |

### Cómo probar (salidas verificadas)
```
curl http://localhost:3000/api/libros
→ [{"id":"1","titulo":"Clean Code","autor":"Robert Martin","prestado":false},
   {"id":"2","titulo":"DDD","autor":"Eric Evans","prestado":true},
   {"id":"3","titulo":"Refactoring","autor":"Martin Fowler","prestado":false}]

curl "http://localhost:3000/api/libros?prestado=true"
→ [{"id":"2","titulo":"DDD","autor":"Eric Evans","prestado":true}]

curl -X POST -H "Content-Type: application/json" \
  -d '{"titulo":"Implementando DDD","autor":"Vaughn Vernon","prestado":false}' \
  http://localhost:3000/api/libros
→ HTTP 201 + {"titulo":"Implementando DDD","autor":"Vaughn Vernon","prestado":false,"id":"4"}

curl -X DELETE -o /dev/null -w "%{http_code}" http://localhost:3000/api/libros/1
→ HTTP 204
```

### Regla práctica
- El controller es solo transporte HTTP: parsea entrada y delega. La lógica vive en providers (semana 3).
- `@HttpCode` se usa para explicitar un status que difiere del default de Nest.

---

## Día 5: Dynamic Modules (introducción) 🟡

### Teoría
Un módulo **estático** se declara con `@Module({...})` fijo. Un módulo **dinámico** devuelve su config en runtime: `static forRoot(...): DynamicModule` (ej. `ConfigModule.forRoot()`, `TypeOrmModule.forRoot()`).

### Cómo se compara con Spring Boot
- Equivalente mental: la autoconfiguración de Spring (`@EnableConfigurationProperties` + `@ConditionalOnProperty`), que arma beans en runtime según argumentos.
- La diferencia clave: en Spring eso se resuelve con annotations condicionales; en Nest el módulo **devuelve** un `DynamicModule` —un objeto con la misma forma que `@Module()`, pero construido en runtime.

### Qué construimos
Lectura, no código: abrir el código fuente de `@nestjs/config` en GitHub y ver qué devuelve `ConfigModule.forRoot()`.

### Cómo probar
```
# no hay comando local: es un ejercicio de lectura del source
# buscá "forRoot" en github.com/nestjs/config → src/config.module.ts
```

### Regla práctica
- `forRoot()` configura una vez (módulo raíz); `forFeature()` registra por feature (lo verás con TypeORM).
- Si un módulo necesita parámetros de arranque, es dinámico.

---

## Día 6-7: Repaso + arquitectura del mini-proyecto 🟡

### Qué construimos (diseño en README, sin código)
```
AppModule
 ├─ LibrosModule    (controllers: [LibrosController]  → luego LibrosService)
 ├─ AutoresModule   (controllers: [AutoresController] → luego AutoresService)
 ├─ PrestamosModule (importa LibrosModule: un préstamo referencia un libro)
 └─ UsuariosModule  (independiente)
```
Regla de dependencias: `PrestamosModule` importa `LibrosModule` porque un préstamo apunta a un libro; para eso `LibrosModule` debe **exportar** `LibrosService`.

---

## Checklist de cierre

- [ ] Explico la diferencia entre arquitectura modular (Nest) y en capas (Spring)
- [ ] Sé qué va en `imports`, `controllers`, `providers` y `exports` sin dudar
- [ ] Genero un módulo y un controller con `nest g` y los cableo al raíz
- [ ] Escribo un controller CRUD con los decoradores de ruta (`@Get/@Post/@Delete`, `@Param/@Query/@Body`)
- [ ] Explico cuándo un módulo es dinámico vs estático
- [ ] Tengo el diagrama de módulos de Biblioteca antes de escribir lógica de negocio
