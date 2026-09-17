# nestjs-learning-path

Ruta de aprendizaje NestJS, semana a semana.

## Estructura

| Carpeta | Qué es |
|---|---|
| `semanaNN/` | semana **resuelta** (referencia, día a día) |
| `practica-semanaNN/` | espejo con `// TODO` para resolver a mano (mirá `../semanaNN` si te trabás) |

## Convención

- Cada semana es un proyecto TypeScript independiente con su `package.json` y `tsconfig.json`.
- La práctica valida incrementalmente con `npx tsc` (compila sin errores en cada paso).
- Base de comparación de todo el path: **Java / Spring Boot**.

## Semanas

| Semana | Tema | Resuelta | Práctica |
|---|---|---|---|
| 01 | TypeScript esencial para Nest | ✅ | 🟡 |

## Cómo usar una práctica

```
cd practica-semana01
npm install
# resolvé los // TODO y después de cada paso:
npx tsc
# al final, corré y compará con la salida de ../semana01
npm run dia1
npm run dia3
npm run dia4
```
