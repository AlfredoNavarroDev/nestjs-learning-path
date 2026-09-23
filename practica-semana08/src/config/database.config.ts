import { registerAs } from '@nestjs/config';

// ── TODO 2: registerAs('database', () => ({ url: process.env.DATABASE_URL })) ──
export default registerAs('database', () => ({}));
