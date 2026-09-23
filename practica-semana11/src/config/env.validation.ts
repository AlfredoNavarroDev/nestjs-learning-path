import * as Joi from 'joi';

// Si falta una variable crítica o tiene formato inválido, Nest falla en el
// bootstrap con un mensaje claro en vez de arrancar y romperse a mitad de
// un request. La versión "endurecida" con Zod llega en la semana 13.
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().uri().required(),
});
