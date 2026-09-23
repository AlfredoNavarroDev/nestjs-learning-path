import * as Joi from 'joi';

// Schema de validación de entorno: si falta una variable crítica o tiene
// formato inválido, Nest falla en el bootstrap con un mensaje claro, en vez
// de arrancar y romperse recién cuando algo intenta usar esa variable.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[smhd]$/)
    .default('15m'),
});
