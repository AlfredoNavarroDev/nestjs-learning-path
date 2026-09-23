# Semana 8 — ConfigModule, env y profiles

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana08/`
> Dominio: Biblioteca — separar configuración de código, con validación al arranque.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `application.properties` / `application-{profile}.properties` | `.env` / `.env.{NODE_ENV}` | mismo rol; Nest usa `dotenv` por debajo |
| `@Value("${db.url}")` | `configService.get('database.url')` | Nest no inyecta el valor directo en el campo, lo pedís al `ConfigService` |
| `@ConfigurationProperties(prefix = "jwt")` | `registerAs('jwt', () => ({...}))` | mismo objetivo: agrupar config por dominio en un objeto tipado |
| `spring.profiles.active=prod` | `NODE_ENV=production` | mismo mecanismo de selección de entorno |
| Falla en el arranque si falta una property `@Required` (con validación custom) | `validationSchema` de Joi en `ConfigModule.forRoot()` | Nest no tiene esto out-of-the-box: hay que declarar el schema explícito |

---

## Día 1-2: ConfigModule básico 🟡

### Teoría
`ConfigModule.forRoot({ isGlobal: true })` carga el `.env` y expone `ConfigService` inyectable en cualquier módulo, sin reimportar `ConfigModule` en cada uno.

### Cómo se compara con Spring Boot
Igual que `application.properties` está disponible en toda la app de Spring sin declarar nada extra por módulo — `isGlobal: true` es el equivalente en Nest.

### Qué construimos
```
ConfigModule.forRoot({ isGlobal: true, envFilePath: [...], ... })
ConfigDemoController → GET /config-demo lee valores vía ConfigService
```

### Cómo probar (salida real)
```
curl http://localhost:3000/api/config-demo
→ {"entorno":"development","puerto":3000,"databaseUrl":"postgres://postgres:postgres@localhost:5432/biblioteca_dev","jwtExpiresIn":"15m","jwtSecretLength":39}
```

### Regla práctica
- `jwtSecretLength` en vez del secret completo: nunca devuelvas secretos por un endpoint, ni en desarrollo.

---

## Día 3: Validación de variables de entorno 🟡

### Teoría
Un schema de Joi (u otra librería) sobre `process.env` valida todo al arrancar. Si falta una variable crítica o tiene formato inválido, `ConfigModule.forRoot()` lanza un error y la app **no arranca**.

### Cómo se compara con Spring Boot
Spring no valida esto de fábrica: normalmente se resuelve con un chequeo manual en un `@PostConstruct` o dejando que falle más tarde con un `NullPointerException` confuso. Nest con `validationSchema` lo hace explícito y falla temprano con un mensaje claro.

### Qué construimos
```
envValidationSchema (Joi): DATABASE_URL requerido y URI válida,
                            JWT_SECRET requerido y mínimo 32 caracteres
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/config/env.validation.ts` | schema de Joi |

### Cómo probar (salida real — falta `DATABASE_URL` y `JWT_SECRET`)
```
mv .env.development .env.development.bak && node dist/main.js
```
```
ERROR [ExceptionHandler] Config validation error: "DATABASE_URL" is required. "JWT_SECRET" is required
Error: Config validation error: ...
```
La app no llega a levantar el servidor HTTP: falla en el bootstrap, antes de `app.listen()`.

### Regla práctica
- Fallar en el arranque (no en el primer request que necesita la variable) es la diferencia entre un error obvio en el deploy y un bug intermitente en producción.

---

## Día 4: Múltiples entornos 🟡

### Teoría
`envFilePath: ['.env.${NODE_ENV}', '.env']` hace que `ConfigModule` cargue el archivo correcto según `NODE_ENV`, con un fallback genérico.

### Cómo se compara con Spring Boot
Mismo mecanismo que `application-dev.properties` / `application-prod.properties` seleccionados por `spring.profiles.active`.

### Qué construimos
```
.env.development  (PORT=3000, DB de desarrollo)
.env.test         (PORT=3001, DB de test separada)
.env.production   (PORT=8080, placeholders a reemplazar en el deploy real)
```

### Regla práctica
- `.env.production` nunca debería tener secretos reales versionados — acá son placeholders a propósito; en un deploy real esas variables van en el proveedor (Render, GitHub Secrets, etc.), no en un archivo commiteado.

---

## Día 5: Configuración tipada con namespaces 🟡

### Teoría
`registerAs('nombre', () => ({...}))` agrupa variables relacionadas en un objeto, accesible como `configService.get('nombre.campo')`, en vez de un blob plano de `process.env` sueltos por toda la app.

### Cómo se compara con Spring Boot
Equivalente directo a `@ConfigurationProperties(prefix = "jwt")` sobre una clase `JwtProperties` — agrupar por dominio en vez de leer properties sueltas por todos lados.

### Qué construimos
```
app.config.ts       → registerAs('app', ...)      { puerto, entorno }
database.config.ts  → registerAs('database', ...) { url }
jwt.config.ts        → registerAs('jwt', ...)       { secret, expiresIn }
```

### Regla práctica
- Un namespace por dominio de configuración (no uno gigante): facilita testear cada parte por separado y evita colisiones de nombres.

---

## Día 6-7: Repaso + configuración final del proyecto 🟡

Toda la configuración de Biblioteca queda basada en variables validadas al arranque, organizadas en namespaces (`app`, `database`, `jwt`), sin ningún valor hardcodeado en el código de negocio.

---

## Checklist de cierre

- [ ] `ConfigModule` es global y no lo reimporto en cada feature module
- [ ] Mi `.env` se valida al arrancar la app (falla si falta algo crítico) — verificado con una corrida real
- [ ] Tengo entornos separados para development, test y production
- [ ] Usé `registerAs()` para al menos un namespace de configuración
