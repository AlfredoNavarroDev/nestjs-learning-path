# Semana 3 — Providers y Dependency Injection

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana03/`
> Dominio: Biblioteca — el corazón de cómo Nest conecta todo: constructor injection, scopes y custom providers.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `@Component` / `@Service` | `@Injectable()` | mismo rol: marca la clase como provider inyectable |
| Beans en el `ApplicationContext` | `providers` del módulo | el "contenedor" es el `Module`, no un contexto global único |
| Constructor injection (recomendado) | Constructor injection (única forma idiomática) | en Nest casi nadie usa injección por propiedad |
| Scope `singleton` (default) / `prototype` / `request` | Scope `DEFAULT` (singleton) / `TRANSIENT` / `REQUEST` | mismos 3 conceptos, nombres distintos |
| `@Bean` con lógica de construcción custom | Custom provider `useFactory` | mismo rol: construir algo que no es una clase directa |
| `@Qualifier("nombre")` para desambiguar interfaces | Token de inyección (`@Inject('TOKEN')`) | Nest no tiene tipos en runtime, así que el token es obligatorio para interfaces |

---

## Día 1-2: Inyección por constructor 🟡

### Teoría
Nest resuelve automáticamente qué inyectar en un constructor usando los metadatos de tipos que TypeScript emite vía `reflect-metadata` (semana 1). No hace falta declarar nada extra: el tipo del parámetro **es** la instrucción de inyección.

### Cómo se compara con Spring Boot
- Ambos frameworks recomiendan constructor injection sobre injección por propiedad (`@Autowired` en un field).
- La diferencia real: Spring puede resolver por tipo **o** por nombre de bean; Nest solo resuelve por tipo (o por token explícito, ver Día 5).

### Qué construimos
```
AutoresService  (provider, sin dependencias)
LibrosService   (provider) --constructor--> depende de AutoresService
LibrosController --constructor--> depende de LibrosService
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/autores/autores.service.ts` | provider sin dependencias |
| `src/libros/libros.service.ts` | provider que inyecta `AutoresService` por constructor |
| `src/libros/libros.controller.ts` | consume `LibrosService` en vez de datos hardcodeados |

### Cómo probar (salida real)
```
curl http://localhost:3000/api/libros
```
```
[{"id":"1","titulo":"Clean Code","autorId":"1","prestado":false},
 {"id":"2","titulo":"DDD","autorId":"2","prestado":true},
 {"id":"3","titulo":"Refactoring","autorId":"3","prestado":false}]
```

### Regla práctica
- Si `LibrosModule` no importa `AutoresModule` (y este no exporta `AutoresService`), Nest tira un error de resolución de dependencias en el bootstrap — nunca en runtime silencioso.

---

## Día 3: Scopes de providers 🟡

### Teoría
`DEFAULT` (singleton, una instancia para toda la app), `REQUEST` (instancia nueva por request entrante) y `TRANSIENT` (instancia nueva cada vez que se inyecta, sin importar el request).

### Cómo se compara con Spring Boot
Los 3 conceptos existen igual en Spring (`singleton`/`prototype`/`request`), pero en Spring el scope `request` necesita un proxy (`proxyMode = TARGET_CLASS`) para funcionar fuera del hilo de la request; en Nest es transparente, Nest lo maneja solo.

### Qué construimos
```
RequestContextService  @Injectable({ scope: Scope.REQUEST })
  └─ creadoEn = Date.now() al construirse
PrestamosController → GET /prestamos/demo-scope devuelve ese timestamp
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/prestamos/request-context.service.ts` | provider con `Scope.REQUEST` |

### Cómo probar (salida real — dos requests distintas)
```
curl http://localhost:3000/api/prestamos/demo-scope
→ {"timestampInstancia":1790140279868}
curl http://localhost:3000/api/prestamos/demo-scope
→ {"timestampInstancia":1790140279922}
```
Cada llamada crea una instancia nueva de `RequestContextService` (timestamp distinto). Con scope `DEFAULT` sería siempre el mismo número.

### Regla práctica
- Usá `REQUEST` scope solo cuando necesites estado real por-request (ej. usuario autenticado). Tiene costo de performance: Nest no puede cachear la instancia.

---

## Día 4: Custom providers 🟡

### Teoría
Un provider no tiene que ser una clase: `useValue` (un valor fijo), `useClass` (elegir la implementación en runtime) o `useFactory` (construir el valor con una función, con sus propias dependencias vía `inject: [...]`).

### Cómo se compara con Spring Boot
Es el equivalente directo a un método `@Bean` con lógica propia dentro de una clase `@Configuration` — en vez de que Spring instancie la clase directo, vos controlás cómo se construye el valor.

### Qué construimos
```
APP_CONFIG (token) ← useFactory: lee process.env.APP_NAME / NODE_ENV
ConfigDemoController → GET /config-demo devuelve { appName, entorno }
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/config/config-demo.provider.ts` | provider `useFactory` + token `APP_CONFIG` |
| `src/config/config-demo.controller.ts` | inyecta `AppConfig` por token |

### Cómo probar (salida real)
```
curl http://localhost:3000/api/config-demo
→ {"appName":"Biblioteca","entorno":"development"}
```

### Regla práctica
- `useFactory` es el lugar correcto para construir algo que depende de variables de entorno o de otro provider — la base conceptual de lo que hará `@nestjs/config` en la semana 8.

---

## Día 5: Tokens de inyección 🟡

### Teoría
Una interfaz de TypeScript se borra al compilar a JS — Nest no puede inyectarla "por tipo" en runtime. Para eso existen los tokens: un string (o `Symbol`) que identifica el provider, independiente de qué clase lo implemente.

### Cómo se compara con Spring Boot
Spring resuelve esto con `@Qualifier("nombreDelBean")` quedándose con el tipo de la interfaz en la firma. Nest necesita el token en **los dos lados**: al registrar el provider (`provide: TOKEN`) y al inyectarlo (`@Inject(TOKEN)`).

### Qué construimos
```
NotificacionSender (interfaz)
 ├─ ConsolaNotificacionService (implementación 1)
 └─ EmailNotificacionService   (implementación 2)
NOTIFICACION_SENDER (token) ← useFactory decide cuál según NOTIFICACION_CANAL
PrestamosService inyecta @Inject(NOTIFICACION_SENDER)
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/notificaciones/notificacion-sender.interface.ts` | contrato |
| `src/notificaciones/consola-notificacion.service.ts` / `email-notificacion.service.ts` | dos implementaciones |
| `src/notificaciones/notificaciones.constants.ts` | token `NOTIFICACION_SENDER` |
| `src/notificaciones/notificaciones.module.ts` | custom provider por token |

### Cómo probar (salida real, log del server al crear un préstamo)
```
curl -X POST -H "Content-Type: application/json" \
  -d '{"libroId":"3","usuario":"ana"}' http://localhost:3000/api/prestamos
```
```
[Nest] LOG [ConsolaNotificacionService] [consola] Préstamo creado: libro 3 para ana
→ {"id":"1","libroId":"3","usuario":"ana","fecha":"2026-09-23T05:11:20.373Z"}
```
Con `NOTIFICACION_CANAL=email` en el entorno, el mismo código usaría `EmailNotificacionService` sin tocar `PrestamosService`.

### Regla práctica
- Si inyectás una interfaz (o un primitivo, o un valor externo tipo cliente Redis), necesitás un token. Si inyectás una clase concreta, no.

---

## Día 6-7: Repaso + capa de servicios del mini-proyecto 🟡

Capa de servicios completa de Biblioteca funcionando end-to-end en memoria: `AutoresService` → `LibrosService` → `PrestamosService`, todos interconectados por DI real, sin base de datos todavía (llega en la semana 5).

---

## Checklist de cierre

- [ ] Explico por qué Nest prefiere constructor injection
- [ ] Sé elegir el scope correcto (`DEFAULT`/`REQUEST`/`TRANSIENT`) según el caso
- [ ] Creo un custom provider con `useFactory` sin mirar la documentación
- [ ] Entiendo cuándo necesito un token de inyección en vez de inyectar por clase
- [ ] Terminé la capa de servicios de Biblioteca con DI real entre las 3 clases
