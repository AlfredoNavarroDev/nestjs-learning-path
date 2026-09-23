# Práctica — Semana 8 (ConfigModule, env y profiles)

Mini-proyecto integrador de la semana 8: configuración de Biblioteca validada y por entornos.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana08` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/config/env.validation.ts` — schema de validación
**Propósito:** que la app falle al arrancar si falta una variable crítica.
**Archivos:** `src/config/env.validation.ts`
- [ ] TODO 1: `DATABASE_URL` requerido (`Joi.string().uri().required()`), `JWT_SECRET` requerido con `.min(32)`, `NODE_ENV` con default `'development'`, `PORT` con default `3000`

### 2. `src/config/database.config.ts` y `src/config/jwt.config.ts` — namespaces
**Propósito:** agrupar configuración por dominio (tu `@ConfigurationProperties`).
**Archivos:** `src/config/database.config.ts`, `src/config/jwt.config.ts`
- [ ] TODO 2: `registerAs('database', () => ({ url: process.env.DATABASE_URL }))`
- [ ] TODO 3: `registerAs('jwt', () => ({ secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' }))`

### 3. `src/app.module.ts` — conectar todo
**Propósito:** activar `ConfigModule` global, con el `.env` correcto por entorno y los namespaces cargados.
**Archivos:** `src/app.module.ts`
- [ ] TODO 4: `isGlobal: true`
- [ ] TODO 5: `envFilePath` según `NODE_ENV`
- [ ] TODO 6: `load: [appConfig, databaseConfig, jwtConfig]`

### 4. `src/main.ts` — usar el puerto configurado
**Propósito:** no hardcodear el puerto en el bootstrap.
**Archivos:** `src/main.ts`
- [ ] TODO 7: `app.listen(configService.get('app.puerto') ?? 3000)`

Después de terminar:

```
npm run build && node dist/main.js
curl http://localhost:3000/api/config-demo
```

Y para comprobar la validación:

```
mv .env.development .env.development.bak
node dist/main.js   # debe fallar con "DATABASE_URL is required..."
mv .env.development.bak .env.development
```

## Checklist de cierre

- [ ] `ConfigModule` es global y no lo reimporto en cada feature module
- [ ] Mi `.env` se valida al arrancar la app (falla si falta algo crítico)
- [ ] Tengo entornos separados para development, test y production
- [ ] Usé `registerAs()` para al menos un namespace de configuración
