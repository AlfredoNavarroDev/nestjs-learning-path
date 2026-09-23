import { envSchema, EnvConfig } from './env.schema';

// ConfigModule.forRoot({ validate }) llama esta función UNA vez con
// process.env crudo. Si falla, lanzamos un Error legible y Nest aborta el
// bootstrap antes de levantar el servidor — "fallar rápido y claro" en vez
// de arrancar y romperse recién cuando algo intenta leer la variable.
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const resultado = envSchema.safeParse(config);

  if (!resultado.success) {
    const mensajes = resultado.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(
      `Configuración de entorno inválida:\n${mensajes}`,
    );
  }

  return resultado.data;
}
