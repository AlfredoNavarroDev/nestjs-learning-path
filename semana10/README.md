# Semana 10 — Carga de archivos y logging

> Base de comparación: **Java / Spring Boot**.
> Proyecto: `semana10/`
> Dominio: Biblioteca — subir portadas de libros y saber qué pasa dentro de la app sin adivinar.

---

## Mapa mental: qué cambia respecto a Spring Boot

| Spring Boot | NestJS | Diferencia clave |
|---|---|---|
| `@RequestParam("file") MultipartFile file` | `@UseInterceptors(FileInterceptor('file'))` + `@UploadedFile()` | Nest necesita el interceptor explícito; Spring resuelve `MultipartFile` directo en la firma |
| `MultipartFile.getContentType()` + validación manual | `fileFilter` en las opciones de `FileInterceptor` | Nest valida el mimetype **antes** de que el archivo llegue al controller |
| `Files.write(path, bytes)` a mano | `diskStorage` (config declarativa) | Nest/Multer arman el guardado en disco sin código manual de I/O |
| `Logger` de SLF4J (`LoggerFactory.getLogger(Clase.class)`) | `new Logger(Clase.name)` (built-in de `@nestjs/common`) | mismo patrón: logger con contexto = nombre de la clase |
| `OncePerRequestFilter` para medir duración | `NestInterceptor` (`intercept()` + RxJS `tap()`) | Nest usa Observables (RxJS) en vez de la cadena de filtros de Servlet |

---

## Día 1-2: Carga de archivos con Multer 🟡

### Teoría
`@UseInterceptors(FileInterceptor('file', opciones))` intercepta `multipart/form-data` y expone el archivo con `@UploadedFile()`. `fileFilter` valida el tipo MIME antes de aceptar el archivo; `limits.fileSize` topea el tamaño.

### Cómo se compara con Spring Boot
Spring resuelve `MultipartFile` directo como parámetro del método, pero la validación de tipo/tamaño es manual (`if (file.getContentType()...)`) dentro del controller o el service. Nest la saca del método de negocio: se declara en la configuración del interceptor.

### Qué construimos
```
POST /libros/:id/portada (multipart/form-data, campo 'file')
  fileFilter: solo image/jpeg, image/png, image/webp
  limits: fileSize 2MB
```

### Cómo probar (salida real)
```
curl -X POST -F "file=@portada.png;type=image/png" http://localhost:3000/api/libros/1/portada
→ 201 {"id":"1","titulo":"Clean Code","portadaUrl":"/uploads/portadas/529d067c-....png"}
```

### Regla práctica
- `fileFilter` rechaza el archivo (no lanza excepción por sí solo): hay que chequear `@UploadedFile()` `undefined` en el controller y lanzar `BadRequestException` ahí.

---

## Día 3: Almacenamiento local vs cloud (conceptual) 🟡

### Teoría
`diskStorage` guarda en el filesystem del servidor — simple, pero no escala si hay más de una instancia corriendo (cada una tendría sus propios archivos) ni sobrevive a un redeploy sin volumen persistente. Un bucket externo (S3, Cloudinary) resuelve ambos problemas a costa de una dependencia externa.

### Cómo se compara con Spring Boot
Mismo trade-off en cualquier stack: `diskStorage` es el equivalente a escribir con `Files.write()` en un directorio local del server.

### Qué construimos
```
diskStorage({ destination: './uploads/portadas', filename: uuid + extname })
```
`randomUUID()` evita colisiones entre portadas de libros distintos (dos archivos "portada.png" no se pisan).

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/libros/libros.controller.ts` | configuración de `diskStorage` + `fileFilter` |
| `uploads/portadas/` | carpeta de destino (con `.gitkeep`, el contenido no se versiona) |

### Regla práctica
- Para este proyecto de práctica, `diskStorage` alcanza. En un proyecto real desplegado en un servicio sin disco persistente (ej. Render free tier), portadas necesitarían un bucket externo.

---

## Día 4: Logger incorporado de Nest 🟡

### Teoría
`new Logger(NombreDeClase)` da un logger con contexto; los niveles (`log`, `error`, `warn`, `debug`, `verbose`) se usan según severidad. Reemplaza `console.log` en código de negocio.

### Cómo se compara con Spring Boot
Mismo patrón que `LoggerFactory.getLogger(MiClase.class)` de SLF4J — el "contexto" (nombre de la clase) aparece en cada línea logueada, para saber de dónde vino sin tener que prefijarlo a mano.

### Qué construimos
```
PrestamosService.logger = new Logger(PrestamosService.name)
  → logger.log('Préstamo creado para el libro X')
```

### Cómo probar (salida real)
```
curl -X POST -d '{"libroId":"1"}' http://localhost:3000/api/prestamos
```
```
[Nest] LOG [PrestamosService] Préstamo creado para el libro 1
```

### Regla práctica
- `console.log` no lleva contexto ni nivel; `Logger` sí — usalo siempre en código de negocio, dejá `console.log` solo para debugging temporal.

---

## Día 5: Interceptors básicos de logging 🟡

### Teoría
Un `NestInterceptor` puede ejecutar código antes **y después** del handler (a diferencia de un middleware, que solo corre antes). `intercept()` recibe un `Observable` de RxJS; `tap()` ejecuta un efecto secundario sin modificar el valor emitido.

### Cómo se compara con Spring Boot
Equivalente a un `OncePerRequestFilter` que mide `Instant.now()` antes de `chain.doFilter()` y de nuevo después — pero en Nest se expresa como un operador RxJS (`tap`) sobre el stream de la respuesta.

### Qué construimos
```
LoggingInterceptor implements NestInterceptor
  → next.handle().pipe(tap(() => logger.log(`${method} ${url} — ${ms}ms`)))
```

### Archivos creados
| Archivo | Rol |
|---|---|
| `src/common/interceptors/logging.interceptor.ts` | interceptor global de logging |
| `src/main.ts` | `app.useGlobalInterceptors(new LoggingInterceptor())` |

### Regla práctica
- Un interceptor global es el lugar correcto para medir latencia; no lo pongas en cada controller por separado.

---

## Día 6-7: Repaso + integración final 🟡

Las portadas de libros quedan con validación completa (tipo + tamaño) y el logging (`Logger` + interceptor global) cubre tanto eventos de negocio (préstamo creado/devuelto) como el tráfico HTTP en general.

---

## Checklist de cierre

- [ ] Mi endpoint de subida valida tipo y tamaño de archivo antes de guardarlo
- [ ] Uso el `Logger` de Nest en vez de `console.log` en el código de negocio
- [ ] Tengo un interceptor de logging global funcionando (verificado con una corrida real)
