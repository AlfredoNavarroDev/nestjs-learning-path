# Semana 13 — Validación de entorno con Zod

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana13/`
> Dominio: Biblioteca — cierre del bloque ampliado: quién valida `process.env` antes de que la app arranque.

---

## Dónde estamos

La semana 8 ya validaba `.env` con **Joi** (`envValidationSchema` + `ConfigModule.forRoot({ validationSchema })`). Esta semana resuelve lo mismo con **Zod**, endureciendo el schema (`JWT_SECRET.min(32)`, formato estricto de `JWT_EXPIRES_IN`) e integrándolo distinto: con la opción `validate` (una función), no `validationSchema` (un objeto Joi).

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `@ConfigurationProperties` + `@Validated` (Bean Validation sobre config) | Zod schema + `ConfigModule.forRoot({ validate })` | Spring valida objetos de config tipados; Zod valida el `Record<string, unknown>` crudo de `process.env` antes de que exista ningún objeto |
| Falla en el arranque si falta una property `@NotNull` | `validate()` lanza `Error` → Nest aborta el bootstrap | Mismo objetivo ("fail fast"), ambos abortan antes de aceptar el primer request |

---

## Día 1: `z.object()` / `.coerce` / `.regex()` 🟡

### Teoría
`z.object()` define la forma esperada de `process.env`. Como toda env var llega como **string**, `.coerce.number()` convierte `"3000"` → `3000` antes de validar que sea positivo. `.regex()` valida formatos que un tipo simple no puede expresar (ej. `JWT_EXPIRES_IN` como `"15m"`, `"2h"`, `"7d"`).

### Qué construimos
```ts
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, '...'),
  JWT_EXPIRES_IN: z.string().regex(/^\d+[smhd]$/, '...').default('15m'),
});
```

---

## Día 2-3: `envSchema` endurecido + mensajes legibles 🟡

### Teoría
`JWT_SECRET.min(32)` no es arbitrario: una clave HMAC corta es fuerza-bruteable; 32 caracteres (256 bits si son aleatorios) es el mínimo razonable para HS256. Cada regla del schema lleva su propio mensaje de error — el objetivo es que quien lea el log del deploy entienda *exactamente* qué variable arreglar, sin adivinar.

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/config/env.schema.ts` | schema Zod + tipo inferido `EnvConfig` |
| `src/config/validate-env.ts` | función `validate()` que usa `ConfigModule.forRoot`; junta todos los `issues` de Zod en un mensaje multilínea |

---

## Día 4-5: Integración en el bootstrap (fail fast) 🟡

### Cómo probar — caso inválido (salida real)
```bash
# .env.development con DATABASE_URL/JWT_SECRET/JWT_EXPIRES_IN inválidos
node dist/main.js
```
```
[Nest] ERROR [ExceptionHandler] Configuración de entorno inválida:
  - DATABASE_URL: DATABASE_URL debe ser una URL válida (postgres://...)
  - JWT_SECRET: JWT_SECRET debe tener al menos 32 caracteres (previene fuerza bruta contra la firma)
  - JWT_EXPIRES_IN: JWT_EXPIRES_IN debe tener formato <número><s|m|h|d>, ej. 15m
Error: Configuración de entorno inválida: ...
    at Object.validateEnv [as validate] (dist/config/validate-env.js:11:15)
    at ConfigModule.forRoot (...)
```
La app **nunca llega a levantar el servidor HTTP** — el error sale del `ConfigModule.forRoot()` dentro de la construcción de `AppModule`, antes de `app.listen()`.

### Cómo probar — caso válido (salida real)
```bash
# .env.development con las 4 variables correctas
node dist/main.js
curl http://localhost:3000/api/config-demo
```
```json
{"entorno":"development","puerto":3000,"databaseUrl":"postgres://postgres:postgres@localhost:5432/biblioteca","jwtExpiresIn":"15m","jwtSecretLength":43}
```

### Regla práctica
- `validate` debe lanzar un `Error` normal (no devolver `undefined` ni loguear y seguir) — es lo único que hace que `ConfigModule.forRoot()` aborte el bootstrap.

---

## Día 6-7: Zod (config estática) vs class-validator (DTOs de request) 🟡

### Teoría
Son dos validaciones con vidas completamente distintas:

| | Zod (`env.schema.ts`) | class-validator (DTOs, semana 4) |
|---|---|---|
| Qué valida | `process.env`, config **estática** | el `body`/`query` de **cada** request HTTP |
| Cuándo corre | una vez, en el bootstrap | en cada request, vía `ValidationPipe` |
| Si falla | la app no arranca (500 en el proceso, no en un response) | esa request devuelve 400, la app sigue corriendo |

### Regla práctica
- Nunca usar `class-validator` para validar `.env` (no hay "request" del cual extraer un DTO) ni Zod para el body de un endpoint público (perderías la integración nativa de Nest con `ValidationPipe`/`class-transformer`) — cada herramienta vive en su capa.

---

## Checklist de cierre

- [ ] Mi `envSchema` cubre las variables realmente críticas del proyecto (no solo las de este demo)
- [ ] Corrí la app con una env var inválida y vi el mensaje de error específico (no un stack trace genérico)
- [ ] Corrí la app con env válida y `/api/config-demo` devolvió la config real
- [ ] Puedo explicar por qué `JWT_SECRET` nunca se devuelve completo en una respuesta HTTP
