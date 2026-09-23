# Semana 12 — Helmet y security headers

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana12/`
> Dominio: Biblioteca — hardening de la API a nivel de headers HTTP.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| Spring Security `headers { ... }` (o `HeaderWriterFilter` manual) | `helmet()` como middleware Express en `main.ts` | Nest delega en la librería `helmet`, no reinventa cada header a mano |
| CSP vía `ContentSecurityPolicyHeaderWriter` | `helmet({ contentSecurityPolicy: { directives: {...} } })` | Misma idea: whitelist declarativa de qué puede cargar/ejecutar el navegador |
| `cors()` de Spring (`CorsConfigurer`) | `app.enableCors()` | Ambos son una capa **distinta** de la de seguridad de headers — CORS regula orígenes, no contenido |

---

## Día 1: `helmet()` en `main.ts` 🟡

### Teoría
`app.use(helmet())` agrega ~15 headers de seguridad HTTP con defaults razonables, en una sola línea. Cada header previene una clase de ataque distinta; no son intercambiables.

### Qué construimos
```ts
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'none'"], imgSrc: ["'self'"], frameAncestors: ["'none'"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

### Regla práctica
- `helmet()` sin configurar ya es mejor que nada, pero la CSP por defecto está pensada para servir HTML — para una API pura hay que apretarla (`default-src 'none'`).

---

## Día 2: Auditoría real con `curl -I`

### Cómo probar
```bash
npm run build && node dist/main.js
curl -I http://localhost:3000/api/libros
```

### Salida real obtenida
```
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'none';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'none';img-src 'self';object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Origin-Agent-Cluster: ?1
Referrer-Policy: no-referrer
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-DNS-Prefetch-Control: off
X-Download-Options: noopen
X-Frame-Options: SAMEORIGIN
X-Permitted-Cross-Domain-Policies: none
X-XSS-Protection: 0
Access-Control-Allow-Origin: *
```

### Qué previene cada header

| Header | Qué previene |
|---|---|
| `Content-Security-Policy` | Inyección de scripts/estilos/recursos externos no autorizados (XSS almacenado/reflejado, exfiltración de datos vía `img-src`/`connect-src` no whitelisteados) |
| `X-Frame-Options: SAMEORIGIN` | Clickjacking — que otro sitio embeba esta API/página en un `<iframe>` para engañar al usuario a hacer clic |
| `X-Content-Type-Options: nosniff` | MIME sniffing — que el navegador "adivine" el content-type y ejecute como script un archivo subido como imagen (relevante acá por el endpoint de portadas de la semana 10) |
| `Strict-Transport-Security` | Downgrade a HTTP tras la primera visita — el navegador fuerza HTTPS en todas las visitas futuras, incluso si un atacante en la red intenta forzar HTTP |
| `Referrer-Policy: no-referrer` | Fuga de URLs internas (con querystrings/tokens) en el header `Referer` cuando el usuario navega a un sitio externo |
| `Cross-Origin-Opener-Policy` / `Cross-Origin-Resource-Policy` | Ataques cross-origin tipo Spectre (que una pestaña maliciosa lea memoria/recursos de esta pestaña) |
| `X-DNS-Prefetch-Control: off` | Prefetch de DNS no deseado que filtra qué dominios visita el usuario a servidores DNS de terceros |
| `X-Download-Options: noopen` | Que IE ejecute un download directamente en el contexto del sitio (histórico, pero gratis de prevenir) |
| `X-Permitted-Cross-Domain-Policies: none` | Que Flash/PDF de Adobe lean datos cross-domain (histórico, gratis de prevenir) |

### Regla práctica
- `X-XSS-Protection: 0` no es un typo: el header legado de XSS-filtering de IE/Chrome viejo se **desactiva** a propósito porque introducía sus propias vulnerabilidades; la protección real la da la CSP.

---

## Día 3: CSP para API vs SPA

### Teoría
Una API JSON pura (como esta) no necesita cargar scripts, estilos ni fuentes — `default-src 'none'` es correcto. Una SPA servida por el mismo Nest (HTML + JS + CSS) necesita habilitar `script-src`/`style-src`/`font-src` para sus propios assets, y explícitamente cualquier CDN externo que use.

### Regla práctica
- Nunca copiar la CSP de una SPA a una API pura (ni viceversa): la CSP correcta depende de qué contenido realmente sirve esa app.

---

## Día 4: CORS como capa complementaria (no reemplazo) de Helmet

### Teoría
CORS (`app.enableCors()`) controla qué **orígenes** pueden leer la respuesta desde JavaScript corriendo en otro dominio. Helmet controla qué puede hacer el **navegador** con esa respuesta una vez la tiene (¿la puede framear? ¿el browser puede "adivinar" su content-type? ¿fuerza HTTPS la próxima vez?). Son ortogonales: se necesitan las dos.

### Regla práctica
- `enableCors()` sin argumentos permite cualquier origen (`Access-Control-Allow-Origin: *`) — para una API pública de solo lectura como esta es aceptable; una API con autenticación/cookies necesita restringir `origin` explícitamente.

---

## Checklist de cierre

- [ ] Corrí `curl -I` contra mi propio endpoint y comparé la salida con la de este README
- [ ] Puedo explicar qué ataque previene cada header sin mirar la tabla
- [ ] Mi CSP está ajustada al tipo de contenido real que sirve la app (API vs SPA)
- [ ] Entiendo por qué CORS y Helmet son necesarios los dos, no uno u otro
