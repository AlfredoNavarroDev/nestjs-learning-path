import { registerAs } from '@nestjs/config';

// ── TODO 3: registerAs('jwt', () => ({ secret, expiresIn })) ──────
export default registerAs('jwt', () => ({}));
