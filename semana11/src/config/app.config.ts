import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  puerto: Number(process.env.PORT ?? 3000),
  entorno: process.env.NODE_ENV ?? 'development',
}));
