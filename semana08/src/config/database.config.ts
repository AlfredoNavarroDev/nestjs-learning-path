import { registerAs } from '@nestjs/config';

// registerAs() agrupa configuración por dominio en un namespace tipado
// ('database', 'jwt', 'app'), en vez de un blob plano de variables sueltas.
// Se consume después con configService.get('database.url') o con @Inject.
export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
}));
