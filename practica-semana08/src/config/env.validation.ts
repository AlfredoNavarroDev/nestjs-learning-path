import * as Joi from 'joi';

// ── TODO 1: DATABASE_URL requerido y URI válida, JWT_SECRET requerido y
// mínimo 32 caracteres. NODE_ENV con default 'development', PORT con
// default 3000 ────────────────────────────────────────────────
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production'),
});
