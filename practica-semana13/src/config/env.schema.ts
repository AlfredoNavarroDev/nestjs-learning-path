import { z } from 'zod';

// z.object() define la forma esperada de process.env. .coerce convierte el
// string crudo de la env var al tipo real (PORT llega como "3000", no 3000).
// A diferencia de class-validator (que valida el *body* de un request en
// cada llamada), esto corre UNA vez, en el bootstrap, contra config estática.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // ── TODO 1: reemplazar por z.coerce.number().int().positive().default(3000) ──
  PORT: z.string().default('3000'),
  // ── TODO 2: agregar .url({ message: '...' }) — hoy acepta cualquier string ──
  DATABASE_URL: z.string(),
  // ── TODO 3: agregar .min(32, '...') — hoy acepta cualquier longitud ──
  JWT_SECRET: z.string(),
  // Formato esperado "<número><unidad>": 15m, 2h, 7d, 30s.
  // ── TODO 4: agregar .regex(/^\d+[smhd]$/, '...') ──
  JWT_EXPIRES_IN: z.string().default('15m'),
});

export type EnvConfig = z.infer<typeof envSchema>;
