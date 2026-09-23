import { envSchema, EnvConfig } from './env.schema';

// ConfigModule.forRoot({ validate }) llama esta función UNA vez con
// process.env crudo. Si falla, lanzamos un Error legible y Nest aborta el
// bootstrap antes de levantar el servidor — "fallar rápido y claro" en vez
// de arrancar y romperse recién cuando algo intenta leer la variable.
export function validateEnv(config: Record<string, unknown>): EnvConfig {
  const resultado = envSchema.safeParse(config);

  // ── TODO 5: if (!resultado.success) { armar mensaje legible con
  //   resultado.error.issues.map(...) y throw new Error(mensaje) } ──
  // Sin esto, un env inválido cae al fallback de abajo en vez de abortar
  // el bootstrap — exactamente lo que "fallar rápido" quiere evitar.

  return resultado.data ?? (config as unknown as EnvConfig);
}
