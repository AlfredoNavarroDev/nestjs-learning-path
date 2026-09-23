import { z } from 'zod';

// z.object() define la forma esperada de process.env. .coerce convierte el
// string crudo de la env var al tipo real (PORT llega como "3000", no 3000).
// A diferencia de class-validator (que valida el *body* de un request en
// cada llamada), esto corre UNA vez, en el bootstrap, contra config estática.
export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().url({ message: 'DATABASE_URL debe ser una URL válida (postgres://...)' }),
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET debe tener al menos 32 caracteres (previene fuerza bruta contra la firma)'),
  // Formato "<número><unidad>": 15m, 2h, 7d, 30s.
  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, 'JWT_EXPIRES_IN debe tener formato <número><s|m|h|d>, ej. 15m')
    .default('15m'),
});

export type EnvConfig = z.infer<typeof envSchema>;
