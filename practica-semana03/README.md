# Práctica — Semana 3 (Providers y Dependency Injection)

Mini-proyecto integrador de la semana 3: capa de servicios de Biblioteca interconectada por DI.
Todos los archivos tienen `// TODO` en vez de la solución.
Si te trabás, mirá `../semana03` (mismo tema ya resuelto, día a día).

Después de cada paso corré:

```
npm run build
```

## Orden sugerido

### 1. `src/libros/libros.service.ts` — inyección por constructor
**Propósito:** `LibrosService` necesita `AutoresService` para validar que el autor exista (tu `@Autowired` por constructor).
**Archivos:** `src/libros/libros.service.ts`
- [ ] TODO 1: inyectar `AutoresService` por constructor
- [ ] TODO 2: en `create()`, validar `this.autoresService.existe(data.autorId)` y lanzar `Error` si no existe

### 2. `src/prestamos/request-context.service.ts` — scope REQUEST
**Propósito:** demostrar que un provider `REQUEST` crea una instancia nueva por cada request (a diferencia del singleton por defecto).
**Archivos:** `src/prestamos/request-context.service.ts`
- [ ] TODO 3: marcar la clase con `@Injectable({ scope: Scope.REQUEST })`
- [ ] TODO 4: capturar `Date.now()` en `creadoEn`

### 3. `src/config/config-demo.provider.ts` — custom provider `useFactory`
**Propósito:** construir un valor de configuración a partir de variables de entorno (tu `@Bean` con lógica propia).
**Archivos:** `src/config/config-demo.provider.ts`
- [ ] TODO 5: `useFactory` que lea `process.env.APP_NAME` (default `'Biblioteca'`) y `process.env.NODE_ENV` (default `'development'`)

### 4. `src/notificaciones/notificaciones.module.ts` — token de inyección
**Propósito:** elegir la implementación de `NotificacionSender` en runtime detrás de un token (tu `@Qualifier`).
**Archivos:** `src/notificaciones/notificaciones.module.ts`
- [ ] TODO 6: `useFactory` que devuelva `EmailNotificacionService` si `NOTIFICACION_CANAL === 'email'`, si no `ConsolaNotificacionService`

### 5. `src/prestamos/prestamos.service.ts` — consumir el token
**Propósito:** inyectar una interfaz (no una clase) usando el token del paso anterior.
**Archivos:** `src/prestamos/prestamos.service.ts`
- [ ] TODO 7: inyectar `LibrosService` y `@Inject(NOTIFICACION_SENDER) notificacionSender: NotificacionSender` por constructor
- [ ] TODO 8: notificar al crear un préstamo
- [ ] TODO 9: notificar al devolver un libro

Después de terminar:

```
npm run start:dev
curl http://localhost:3000/api/prestamos/demo-scope
curl http://localhost:3000/api/prestamos/demo-scope
# los dos timestamps deben ser distintos
curl -X POST -H "Content-Type: application/json" \
  -d '{"libroId":"3","usuario":"ana"}' http://localhost:3000/api/prestamos
```

## Checklist de cierre

- [ ] Explico por qué Nest prefiere constructor injection
- [ ] Sé elegir el scope correcto (`DEFAULT`/`REQUEST`/`TRANSIENT`) según el caso
- [ ] Creo un custom provider con `useFactory` sin mirar la documentación
- [ ] Entiendo cuándo necesito un token de inyección en vez de inyectar por clase
- [ ] Terminé la capa de servicios de Biblioteca con DI real entre las 3 clases
